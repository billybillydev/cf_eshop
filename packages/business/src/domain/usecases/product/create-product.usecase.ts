import { CreateProductDTO } from "$domain/dtos";
import { ProductEntity } from "$domain/entities";
import { ProductRepositoryInterface } from "$infrastructure/ports";

export class CreateProductUseCase {
    constructor(private readonly productRepository: ProductRepositoryInterface) {}

    async execute(productData: CreateProductDTO): Promise<ProductEntity> {
        return this.productRepository.save(productData);
    }
}