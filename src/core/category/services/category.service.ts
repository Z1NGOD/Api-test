import { BadRequestException, Injectable } from "@nestjs/common";
import { CategoryRepository } from "@lib/db/repositoires/category.repository";

import { CreateCategoryDto, UpdateCategoryDto } from "../dto";
import { CloudinaryService } from "@lib/cloudinary/services/cloudinary.service";
import { ImageRepository } from "@lib/db/repositoires/image.repository";
import slugify from "slugify";
import { SearchCategoryDto } from '../dto/search-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        private readonly categoryRepository: CategoryRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly imageRepository: ImageRepository,
    ) {}

    async create(data: CreateCategoryDto) {
        const hasExist = await this.categoryRepository.findBySlug(slugify(String(data.name.pl), { lower: true }));
        if (hasExist) throw new BadRequestException("Category already exists");

        const upload = await this.cloudinaryService.uploadFile(data.image);
        const imageDocument = await this.imageRepository.create(upload.public_id, upload.url);

        return await this.categoryRepository.create({
            ...data,
            image: imageDocument._id.toString(),
        });
    }

    async findAll(data: SearchCategoryDto) {
        return await this.categoryRepository.findAll(data);
    }

    async findOne(id: string) {
        const category = await this.categoryRepository.findOne(id);

        if (!category) throw new BadRequestException("Category not found");
        return category;
    }

    async findBySlug(slug: string) {
        const category = await this.categoryRepository.findBySlug(slug);
        if (!category) throw new BadRequestException("Category not found");

        return category;
    }

    async update(id: string, data: UpdateCategoryDto) {
        const category = await this.categoryRepository.findOne(id);
        if (!category) throw new BadRequestException("Category not found");

        let uplaod: string;

        if (data.image) {
            const response = await this.cloudinaryService.updateFile(data.image, category.image.public_id);
            const image = await this.imageRepository.create(response.public_id, response.url);
            uplaod = image._id.toString();
        }

        return await this.categoryRepository.update(id, {
            ...data,
            slug: slugify(String(data.name.pl), { lower: true }),
            image: uplaod,
        });
    }

    async remove(id: string) {
        const category = await this.categoryRepository.findOne(id);
        if (!category) throw new BadRequestException("Category not found");

        await this.cloudinaryService.destroyFile(category.image.public_id);
        await this.imageRepository.remove(category.image.public_id);

        await this.categoryRepository.remove(id);
    }
}
