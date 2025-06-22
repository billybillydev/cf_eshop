import type { CartEntity } from "$domain/entities";
import type { CartRepositoryInterface } from "$infrastructure/ports";

export class GetCartUseCase {
  private readonly cartRepository!: CartRepositoryInterface;

  constructor(cartRepository: CartRepositoryInterface) {
    this.cartRepository = cartRepository;
  }

  async execute(): Promise<CartEntity> {
    return this.cartRepository.getCart();
  }
}
