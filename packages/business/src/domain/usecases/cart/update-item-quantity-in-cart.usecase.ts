import { CartEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import { CartRepositoryInterface } from "$infrastructure/ports";

export class UpdateItemQuantityInCartUseCase {
    private readonly cartRepository!: CartRepositoryInterface;

    constructor(cartRepository: CartRepositoryInterface) {
        this.cartRepository = cartRepository;
    }

    execute(productId: IdObject, quantity: number): Promise<CartEntity> {
        return this.cartRepository.updateItemQuantityInCart(productId, quantity);
    }
}