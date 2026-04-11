import { CustomerEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import {
  CustomerRepositoryInterface,
  FavoriteRepositoryInterface,
  ProductRepositoryInterface,
} from "$infrastructure/ports";

type DeleteFavoriteRequest = {
  customerId: number;
  productId: number;
};

export class DeleteFavoriteUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface,
    private readonly favoriteRepository: FavoriteRepositoryInterface
  ) {}

  async execute(request: DeleteFavoriteRequest): Promise<{ success: true }> {
    const [customer, product] = await Promise.all([
      this.customerRepository.getById(new IdObject(request.customerId)),
      this.productRepository.getById(new IdObject(request.productId)),
    ]);
    if (!customer) {
      throw new Error("Customer not found");
    }
    if (!product) {
      throw new Error("Product not found");
    }

    const result = await this.favoriteRepository.remove(
      new IdObject(request.customerId),
      new IdObject(request.productId)
    );
    if (!result.success) {
      throw new Error(result.message);
    }
    return { success: true };
  }
}
