import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema, Image, ImageSchema, Product, ProductSchema, User, UserSchema, Comment, CommentSchema, Category, CategorySchema, Order, OrderSchema } from "./models";
import { UserRepository, ImageRepository, ProductRepository, CartRepository, CategoryRepository, CommentRepository, OrderRepository } from "@lib/db/repositoires";
import { MailService } from "@lib/mail/services";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.DB_URI,
                retryAttempts: 2,
                retryDelay: 2000,
            }),
        }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Product.name, schema: ProductSchema },
            { name: Cart.name, schema: CartSchema },
            { name: Image.name, schema: ImageSchema },
            { name: Comment.name, schema: CommentSchema },
            { name: Cart.name, schema: CartSchema },
            { name: Category.name, schema: CategorySchema },
            { name: Order.name, schema: OrderSchema },
        ]),
    ],
    providers: [UserRepository, ImageRepository, ProductRepository, CartRepository, CommentRepository, CategoryRepository, CartRepository, OrderRepository, MailService],
    exports: [MongooseModule, UserRepository, ImageRepository, ProductRepository, CategoryRepository, CartRepository, OrderRepository],
})
export class DbModule {}
