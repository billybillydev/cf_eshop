import type { ProductEntity } from "$domain/entities";
import type { ProductRepositoryInterface } from "$infrastructure/ports";

export class GetProductByCodeUseCase {
  private readonly productRepository!: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(code: string): Promise<ProductEntity | null> {
    return this.productRepository.getByCode(code);
  }
}
