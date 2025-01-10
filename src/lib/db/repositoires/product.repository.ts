import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateProductDto, UpdateProductDto } from "@core/product/dto";
import { Product, ProductDocument } from "@lib/db/models";
import { SearchQueryFilter } from "@common/types/search-filter";

@Injectable()
export class ProductRepository {
    constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

    async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
        return (await this.productModel.create(createProductDto)).populate("images");
    }

    async findAll(query: SearchQueryFilter, skip: number, limit: number, sort: any): Promise<ProductDocument[]> {
        return await this.productModel.aggregate([
            { $match: query },
            { $sort: { ...sort, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "images",
                    localField: "images",
                    foreignField: "_id",
                    as: "images",
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",  
                    foreignField: "_id",   
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                }
            },
        ]);
    }

    async findCount(query: SearchQueryFilter): Promise<number> {
        return this.productModel.countDocuments(query);
    }

    async findOne(id: string): Promise<ProductDocument> {
        return await this.productModel.findById(id).populate("images category");
    }

    async updateRating(productId: string, rating: number): Promise<ProductDocument> {
        return this.productModel.findByIdAndUpdate(productId, { rating: rating.toFixed(1) }, { new: true });
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
        return await this.productModel.findByIdAndUpdate(id, updateProductDto);
    }

    async remove(id: string): Promise<void> {
        return await this.productModel.findByIdAndDelete(id);
    }
}
