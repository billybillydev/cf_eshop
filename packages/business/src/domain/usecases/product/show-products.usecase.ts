import type { ProductItemEntity } from "$domain/entities";
import type { ProductPaginationParameters, ProductRepositoryInterface } from "$infrastructure/ports";

export class ShowProductsUseCase {
  private readonly productRepository!: ProductRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface) {
    this.productRepository = productRepository;
  }

  async execute(): Promise<ProductItemEntity[]>;
  async execute(
    paginationParams: ProductPaginationParameters
  ): Promise<[ProductItemEntity[], number]>;
  async execute(
    paginationParams?: ProductPaginationParameters
  ) {
    if (paginationParams) {
      return this.productRepository.paginate(paginationParams);
    }
    return this.productRepository.showAll();
  }
}
