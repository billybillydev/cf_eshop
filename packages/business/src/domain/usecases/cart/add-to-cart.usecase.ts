import type { CartEntity, CartItemProductEntity } from "$domain/entities";
import type { CartRepositoryInterface } from "$infrastructure/ports";

export class AddToCartUseCase {
  private readonly cartRepository!: CartRepositoryInterface;

  constructor(cartRepository: CartRepositoryInterface) {
    this.cartRepository = cartRepository;
  }

  async execute(productId: CartItemProductEntity, quantity?: number): Promise<CartEntity> {
    return this.cartRepository.addToCart(productId, quantity);
  }
}
