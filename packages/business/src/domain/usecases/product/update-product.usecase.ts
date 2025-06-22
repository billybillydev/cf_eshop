import { UpdateProductDTO } from "$domain/dtos";
import { ProductEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import { ProductRepositoryInterface } from "$infrastructure/ports";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(id: IdObject, productData: UpdateProductDTO): Promise<ProductEntity> {
    return this.productRepository.update(id, productData);
  }
}