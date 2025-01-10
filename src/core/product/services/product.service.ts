import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto, UpdateProductDto } from "@core/product/dto";
import { ProductRepository, ImageRepository } from "@lib/db/repositoires";
import { CloudinaryService } from "@lib/cloudinary/services/cloudinary.service";
import { SearchProductDto, PaginationDto } from "@core/product/dto";
import { Image } from "@lib/db/models";
import { UserRepository } from "@lib/db/repositoires/user.repository";
import { Types } from "mongoose";
import { SortQueryOptions } from "@common/types";
import slugify from "slugify";

@Injectable()
export class ProductService {
    constructor(
        private readonly imageRepository: ImageRepository,
        private readonly productRepository: ProductRepository,
        private readonly userRepository: UserRepository,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async create(createProductDto: CreateProductDto) {
        const images: string[] = await Promise.all(
            createProductDto.images.map(async image => {
                const response = await this.cloudinaryService.uploadFile(image);
                const imageDocument = await this.imageRepository.create(response.public_id, response.url);
                return imageDocument._id.toString();
            }),
        );

        const product = await this.productRepository.create({
            ...createProductDto,
            slug: slugify(createProductDto.name.pl, { lower: true }),
            images,
        });

        return product;
    }

    async findAll(search: SearchProductDto, pagination: PaginationDto) {
        const query: any = {};

        if (search.name) {
            query.$or = [
                { "name.uk": { $regex: search.name, $options: "i" } },
                { "name.pl": { $regex: search.name, $options: "i" } },
                { "name.de": { $regex: search.name, $options: "i" } },
            ];
        }

        if (search.attributes) {
           query.$or = [
            { "attributes.pl.value": { $in: search.attributes.split(",") } },
            { "attributes.de.value": { $in: search.attributes.split(",") } },
            { "attributes.uk.value": { $in: search.attributes.split(",") } },
           ]
        }

        if (search.manufacturer) {
            query.manufacturer = { $in: search.manufacturer.split(",") };
        }
        if (search.category) {
            query.category = {
                $in: search.category.split(",").map((id) => new Types.ObjectId(id)),
            };
        }

        if (search.minPrice) query.price = { $gte: Number(search.minPrice) };
        if (search.maxPrice) {
            query.price = { ...query.price, $lte: Number(search.maxPrice) };
        }

        if (search.discount !== undefined) {
            if (search.discount === "true") {
                query.discount = { $exists: true, $ne: null };
            } else {
                query.discount = { $exists: false };
            }
        }

        const page: number = Number(pagination.page) || 1;
        let limit: number = Number(pagination.limit) || 10;

        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        const sort: SortQueryOptions = {};

        if (search.sortByPrice) {
            sort.price = search.sortByPrice === "asc" ? 1 : -1;
        }
        if (search.sortByName) {
            sort.name = search.sortByName === "asc" ? 1 : -1;
        }
        if (search.sortByRating) {
            sort.rating = search.sortByRating === "asc" ? 1 : -1;
        }

        const [products, total] = await Promise.all([this.productRepository.findAll(query, skip, limit, sort), this.productRepository.findCount(query)]);
        const pages = Math.ceil(total / limit);

        return {
            products,
            total,
            pages,
            hasNext: page < pages,
            hasPrev: page > 1,
            nextPage: page < pages ? page + 1 : null,
        };
    }

    async findOne(id: string) {
        return await this.productRepository.findOne(id);
    }

    async findFavorites(userId: string) {
        const user = await this.userRepository.findOne(userId);
        if (!user) throw new NotFoundException("User not found");

        return await this.userRepository.findToFavorites(userId);
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const product = await this.productRepository.findOne(id);
        if (!product) throw new NotFoundException("Product not found");
    
        if (updateProductDto.images && updateProductDto.images.length > 0) {
            await this.handleImagesUpdate(product.images, updateProductDto.images);
        }
    
        // Обновление продукта
        const updatedProduct = await this.productRepository.update(id, {
            ...updateProductDto,
            images: updateProductDto.images?.map((image: any) => image._id) || product.images.map((image: any) => image._id),
        });
    
        return updatedProduct;
    }

    async addToFavorites(productId: string, userId: string) {
        const product = await this.productRepository.findOne(productId);
        if (!product) throw new NotFoundException("Product not found");

        return await this.userRepository.addToFavorites(userId, productId);
    }

    async removeFromFavorites(productId: string, userId: string) {
        const product = await this.productRepository.findOne(productId);
        if (!product) throw new NotFoundException("Product not found");

        return await this.userRepository.removeFromFavorites(userId, productId);
    }

    async remove(id: string) {
        const product = await this.productRepository.findOne(id);

        await Promise.all(
            product.images.map(async (image: Image) => {
                await this.cloudinaryService.destroyFile(image.public_id);
                await this.imageRepository.remove(image.public_id);
            }),
        );

        return await this.productRepository.remove(id);
    };

    private async handleImagesUpdate(oldImages: Image[], newImages: string[]) {
        await this.deleteOldImages(oldImages);
        const updatedImages = await this.uploadNewImages(newImages);
        return updatedImages;
    }
    
    private async deleteOldImages(images: Image[]) {
        await Promise.all(
            images.map(async (image: Image) => {
                await this.cloudinaryService.destroyFile(image.public_id);
                await this.imageRepository.remove(image.public_id);
            }),
        );
    }
    
    private async uploadNewImages(images: string[]): Promise<string[]> {
        return await Promise.all(
            images.map(async (image: string) => {
                const response = await this.cloudinaryService.uploadFile(image);
                const imageDocument = await this.imageRepository.create(response.public_id, response.url);
                return imageDocument._id.toString();
            }),
        );
    }
}
