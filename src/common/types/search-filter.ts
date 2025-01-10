import { SearchProductDto } from "@core/product/dto";
import { Types } from "mongoose";

export type SearchQueryFilter = Partial<
    Record<keyof Pick<SearchProductDto, "name" | "category">, { $regex: string; $options: string } | Types.ObjectId> &
        Record<"price", { $gte: number; $lte?: number }> &
        Record<"discount", { $exists: boolean; $ne?: null }> &
        Record<"manufacturer", { $in: { $regex: string; $options: string }[] | { $regex: string; $options: string } }> &
        Record<"attributes.width", { $in: { $regex: string; $options: string }[] } | { $regex: string; $options: string }> &
        Record<"attributes.height", { $in: { $regex: string; $options: string }[] } | { $regex: string; $options: string }> &
        Record<"attributes.depth", { $in: { $regex: string; $options: string }[] } | { $regex: string; $options: string }>
>;
