import { CreateProductDTO, UpdateProductDTO } from "$domain/dtos";
import type { CategoryEntity, ProductEntity, ProductItemEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";

export type ProductFilterParameters = {
  category?: CategoryEntity["name"];
  productName?: ProductEntity["name"];
};

export type ProductPaginationParameters = ProductFilterParameters & {
  page?: number;
  limit?: number;
};

export interface ProductRepositoryInterface {
  save(productData: CreateProductDTO): Promise<ProductEntity>;
  showAll(): Promise<ProductItemEntity[]>;
  getById(id: IdObject): Promise<ProductEntity | null>;
  getByCode(id: string): Promise<ProductEntity | null>;
  update(id: IdObject, productData: UpdateProductDTO): Promise<ProductEntity>;
  remove(id: IdObject): Promise<ProductEntity>;
  filter?: (params: ProductFilterParameters) => Promise<ProductItemEntity[]>;
  paginate(
    params: ProductPaginationParameters
  ): Promise<[ProductItemEntity[], number]>;
}
