import { CartItemEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import { CartRepositoryInterface } from "$infrastructure/ports";

export class GetCartItemByProductIdUseCase {
    constructor(private cartRepository: CartRepositoryInterface) {}

    async execute(productId: IdObject): Promise<CartItemEntity | null> {
        return this.cartRepository.getCartItemByProductId(productId);
    }
}