import { FavoriteDTO } from "$domain/dtos/favorite";
import { InventoryStatus } from "$domain/entities/product/product.entity";
import { IdObject } from "$domain/value-objects";

export class FavoriteEntity {
  readonly id: IdObject;
  readonly productId: IdObject;
  readonly customerId: IdObject;
  productImage: string;
  inventoryStatus: InventoryStatus;

  constructor(dto: FavoriteDTO) {
    this.id = new IdObject(dto.id);
    this.productId = new IdObject(dto.productId);
    this.customerId = new IdObject(dto.customerId);
    this.productImage = dto.productImage;
    this.inventoryStatus = dto.inventoryStatus;
  }

  transformToDTO(): FavoriteDTO {
    return {
      id: this.id.value(),
      productId: this.productId.value(),
      customerId: this.customerId.value(),
      productImage: this.productImage,
      inventoryStatus: this.inventoryStatus,
    };
  }
}
