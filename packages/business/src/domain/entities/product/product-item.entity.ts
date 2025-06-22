import { ProductItemDTO } from "$domain/dtos";
import { CategoryEntity } from "$domain/entities/category.entity";
import { InventoryStatus } from "$domain/entities/product/product.entity";
import { IdObject, PriceObject } from "$domain/value-objects";

export class ProductItemEntity {
  readonly id: IdObject;
  readonly name: string;
  readonly code: string;
  readonly category: CategoryEntity;
  readonly price: PriceObject;
  readonly image: string;
  readonly internalReference: string;
  readonly shellId: IdObject;
  readonly inventoryStatus: InventoryStatus = "OUTOFSTOCK";
  readonly rating: number = 0;

  constructor(productData: {
    id: IdObject;
    name: string;
    code: string;
    category: CategoryEntity;
    price: PriceObject;
    image: string;
    internalReference: string;
    shellId: IdObject;
    inventoryStatus?: InventoryStatus;
    rating?: number;
  }) {
    this.id = productData.id;
    this.name = productData.name;
    this.code = productData.code;
    this.category = productData.category;
    this.price = productData.price;
    this.image = productData.image;
    this.internalReference = productData.internalReference;
    this.shellId = productData.shellId;
    if (productData.inventoryStatus) {
      this.inventoryStatus = productData.inventoryStatus;
    }
    if (productData.rating) {
      this.rating = productData.rating;
    }
  }

  transformToDTO(): ProductItemDTO {
    return {
      id: this.id.value(),
      name: this.name,
      code: this.code,
      price: this.price.getValue(),
      image: this.image,
      category: this.category.transformToDTO(),
      internalReference: this.internalReference,
      shellId: this.shellId.value(),
      inventoryStatus: this.inventoryStatus,
      rating: this.rating,
    };
  }

  static transformToEntity(
    product: ProductItemDTO
  ): ProductItemEntity {
    return new ProductItemEntity({
      ...product,
      id: new IdObject(product.id),
      price: new PriceObject(product.price),
      shellId: new IdObject(product.shellId),
      category: CategoryEntity.transformToEntity(product.category),
    });
  }
}
