import { CartItemProductDTO } from "$domain/dtos/cart/cart-item-product.dto";
import { CategoryEntity } from "$domain/entities/category.entity";
import { ProductEntity } from "$domain/entities/product";
import { IdObject, PriceObject } from "$domain/value-objects";

export class CartItemProductEntity {
  readonly id: ProductEntity["id"];
  readonly name: ProductEntity["name"];
  readonly code: ProductEntity["code"];
  readonly price: ProductEntity["price"];
  readonly image: ProductEntity["image"];
  readonly category: ProductEntity["category"];
  readonly inventoryStatus: ProductEntity["inventoryStatus"] = "INSTOCK";

  constructor(dto: CartItemProductDTO) {
    this.id = new IdObject(dto.id);
    this.name = dto.name;
    this.code = dto.code;
    this.price = new PriceObject(dto.price);
    this.image = dto.image;
    this.category = new CategoryEntity(dto.category);
    if (dto.inventoryStatus) {
      this.inventoryStatus = dto.inventoryStatus;
    }
  }

  transformToDTO(): CartItemProductDTO {
    return {
      id: this.id.value(),
      name: this.name,
      code: this.code,
      image: this.image,
      price: this.price.getValue(),
      category: this.category.transformToDTO(),
      inventoryStatus: this.inventoryStatus,
    };
  }
}
