import type { ProductEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import type { ProductRepositoryInterface } from "$infrastructure/ports";

export class GetProductByIdUseCase {
  private readonly productRepository!: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(id: IdObject): Promise<ProductEntity | null> {
    return this.productRepository.getById(id);
  }
}
