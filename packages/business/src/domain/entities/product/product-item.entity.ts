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

  constructor(dto: ProductItemDTO) {
    this.id = new IdObject(dto.id);
    this.name = dto.name;
    this.code = dto.code;
    this.category = new CategoryEntity(dto.category);
    this.price = new PriceObject(dto.price);
    this.image = dto.image;
    this.internalReference = dto.internalReference;
    this.shellId = new IdObject(dto.shellId);
    if (dto.inventoryStatus) {
      this.inventoryStatus = dto.inventoryStatus;
    }
    if (dto.rating) {
      this.rating = dto.rating;
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
}
