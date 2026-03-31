import { CartItemDTO } from "$domain/dtos/cart/cart-item.dto";
import { CartItemProductEntity } from "$domain/entities/cart/cart-item-product.entity";

export class CartItemEntity {
  #product!: CartItemProductEntity;
  #quantity!: number;

  constructor(dto: CartItemDTO) {
    this.#product = new CartItemProductEntity(dto.product);
    this.#quantity = dto.quantity ?? 1;
  }

  get product() {
    return this.#product;
  }

  get quantity() {
    return this.#quantity;
  }

  updateQuantity(value: number) {
    this.#quantity += value;
  }

  setQuantity(value: number) {
    this.#quantity = value;
  }

  transformToDTO(): CartItemDTO {
    return {
      product: this.product.transformToDTO(),
      quantity: this.quantity,
    };
  }
}
