import { ProductEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import { ProductRepositoryInterface } from "$infrastructure/ports";

export class RemoveProductUseCase {
    constructor(private productRepository: ProductRepositoryInterface) {}

    async execute(id: IdObject): Promise<ProductEntity> {
        return this.productRepository.remove(id);
    }
}