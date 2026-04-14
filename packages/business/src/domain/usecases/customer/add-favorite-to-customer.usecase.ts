import { CustomerEntity } from "$domain/entities";
import { FavoriteVO, IdObject } from "$domain/value-objects";
import {
  CustomerRepositoryInterface,
  ProductRepositoryInterface,
} from "$infrastructure/ports";
import { FavoriteRepositoryInterface } from "$infrastructure/ports/favorite.repository.interface";

export type AddProductToCustomerFavoriteRequest = {
  customerId: number;
  productId: number;
};

export class AddProductToCustomerFavoriteUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface,
    private readonly favoriteRepository: FavoriteRepositoryInterface
  ) {}

  async execute(
    request: AddProductToCustomerFavoriteRequest
  ): Promise<{ success: true }> {
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

    const result = await this.favoriteRepository.add(
      customer.id,
      new FavoriteVO({
        productId: product.id.value(),
        productCode: product.code,
        productName: product.name,
        productImage: product.image,
        inventoryStatus: product.inventoryStatus,
      })
    );

    if (!result.success) {
      throw new Error(result.message);
    }

    return { success: true };
  }
}
