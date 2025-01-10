import { Injectable } from "@nestjs/common";
import { CreateCartDto, UpdateCartDto, UpdateProductInCart } from "../dto";
import { CartRepository } from "@lib/db/repositoires";

@Injectable()
export class CartService {
    constructor(private readonly cartRepository: CartRepository) {}
    create(createCartDto: CreateCartDto) {
        return this.cartRepository.create(createCartDto);
    }

    clear(userId: string) {
        return this.cartRepository.clear(userId);
    }

    findByUserId(userId: string) {
        return this.cartRepository.findByUserId(userId);
    }

    add(userId: string, updateCartDto: UpdateCartDto) {
        return this.cartRepository.add(userId, updateCartDto);
    }

    update(userId: string, updateCartDto: UpdateProductInCart) {
        return this.cartRepository.update(userId, updateCartDto);
    }

    remove(userId: string, productId: string) {
        return this.cartRepository.remove(userId, productId);
    }
}
