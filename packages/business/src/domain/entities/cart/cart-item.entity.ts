import { CartItemDTO } from "$domain/dtos/cart/cart-item.dto";
import { CartItemProductEntity } from "$domain/entities/cart/cart-item-product.entity";

export class CartItemEntity {
  #product!: CartItemProductEntity;
  #quantity!: number;

  constructor(data: { product: CartItemProductEntity; quantity?: number }) {
    this.#product = data.product;
    this.#quantity = data.quantity ?? 1;
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

  static transformToEntity({ product, quantity }: CartItemDTO) {
    return new CartItemEntity({
      product:
        CartItemProductEntity.transformToEntity(product),
      quantity,
    });
  }
}
