import type { CartEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import type { CartRepositoryInterface } from "$infrastructure/ports";

export class DeleteItemFormCartUseCase {
  private readonly cartRepository!: CartRepositoryInterface;

  constructor(cartRepository: CartRepositoryInterface) {
    this.cartRepository = cartRepository;
  }

  async execute(productId: IdObject): Promise<CartEntity> {
    return this.cartRepository.deleteItemFromCart(productId);
  }
}
