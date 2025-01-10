import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCategoryDto, UpdateCategoryDto } from "@core/category/dto";
import { Category, CategoryDocument } from "../models/category.schema";
import slugify from "slugify";
import { SearchCategoryDto } from "@core/category/dto/search-category.dto";

@Injectable()
export class CategoryRepository {
    constructor(@InjectModel("Category") private readonly categoryModel: Model<Category>) {}

    async create(data: CreateCategoryDto): Promise<CategoryDocument> {
        return await this.categoryModel.create({
            ...data,
            slug: slugify(String(data.name.pl), {
                lower: true,
            }),
        });
    }

    async findAll(data: SearchCategoryDto): Promise<any> {
        const page: number = Number(data.page) || 1;
        const limit: number = Math.min(Number(data.limit) || 10, 50);
    
        const skip = (page - 1) * limit;
    
        const matchFilter: any = {};
        if (data.name) {
            matchFilter.$or = [
                { "name.uk": { $regex: data.name, $options: "i" } },
                { "name.pl": { $regex: data.name, $options: "i" } },
                { "name.de": { $regex: data.name, $options: "i" } },
            ];
        }
    
        const [categories, total] = await Promise.all([
            this.categoryModel.aggregate([
                { $match: matchFilter },
                { $sort: { createAt: -1 } },
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: "images",
                        localField: "image",
                        foreignField: "_id",
                        as: "image",
                    },
                },
                {
                    $addFields: {
                        image: { $arrayElemAt: ["$image", 0] },
                    },
                },
            ]),
            this.categoryModel.countDocuments(matchFilter),
        ]);
    
        const pages = Math.ceil(total / limit);
    
        return {
            categories,
            total,
            pages,
            hasNext: page < pages,
            hasPrev: page > 1,
            nextPage: page < pages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
        };
    }
    

    async findOne(id: string): Promise<CategoryDocument> {
        return await this.categoryModel.findById(id).populate("image");
    };

    async findBySlug(slug: string): Promise<CategoryDocument> {
        return await this.categoryModel.findOne({ slug }).populate("image");
    };

    async update(id: string, data: UpdateCategoryDto): Promise<CategoryDocument> {
        return await this.categoryModel.findByIdAndUpdate(id, data).populate("image");
    };

    async addProduct(categoryId: string, productId: string): Promise<CategoryDocument> {
        return await this.categoryModel.findByIdAndUpdate(categoryId, {
            $push: { products: productId },
        });
    };

    async remove(id: string): Promise<void> {
        return await this.categoryModel.findByIdAndDelete(id);
    };
};
