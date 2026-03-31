import {
  CartDTO
} from "$domain/dtos/cart/cart.dto";
import { CartItemProductEntity } from "$domain/entities/cart/cart-item-product.entity";
import { CartItemEntity } from "$domain/entities/cart/cart-item.entity";
import { IdObject, PriceObject } from "$domain/value-objects";

export class CartEntity {
  #items: CartItemEntity[] = [];
  #totalQuantity: number = 0;

  constructor(dto?: CartDTO) {
    if (dto) {
      this.#items = dto.items.map((item) => new CartItemEntity(item));
      this.#totalQuantity = dto.totalQuantity ?? 0;
    }
  }

  get items() {
    return this.#items;
  }

  get totalQuantity() {
    return this.#totalQuantity;
  }

  getItem(productId: IdObject) {
    return this.#items.find((item) => item.product.id.equals(productId));
  }

  addItem(product: CartItemProductEntity, quantity: number = 1) {
    const existingCartItemIndex = this.#items.findIndex((item) => {
      return item.product.id.equals(product.id);
    });
    if (existingCartItemIndex < 0) {
      const newItem = new CartItemEntity({ product: product.transformToDTO(), quantity });
      this.#items.push(newItem);
    } else {
      this.#items[existingCartItemIndex].updateQuantity(quantity);
    }
    this.#totalQuantity += quantity;
  }

  deleteItem(productId: IdObject) {
    const existingCartItem = this.#items.find((item) =>
      item.product.id.equals(productId)
    );
    if (existingCartItem) {
      this.#items = this.#items.filter(
        (item) => !item.product.id.equals(productId)
      );
      this.#totalQuantity -= existingCartItem.quantity;
    }
  }

  updateItemQuantity(productId: IdObject, quantity: number) {
    const existingCartItemIndex = this.#items.findIndex((item) => {
      return item.product.id.equals(productId);
    });
    if (existingCartItemIndex < 0) {
      throw new Error(`Product in cart with id ${productId} not found`);
    }

    if (quantity < 1) {
      this.deleteItem(this.#items[existingCartItemIndex].product.id);
    } else {
      this.#items[existingCartItemIndex].setQuantity(quantity);
      this.#totalQuantity = this.#items.reduce(
        (acc, cur) => acc + cur.quantity,
        0
      );
    }
  }

  calculateTotalPrice(): PriceObject {
    return new PriceObject(
      this.items.reduce(
        (acc, cur) =>
          (acc += Number(cur.product.price.getValue()) * cur.quantity),
        0
      )
    );
  }

  transformToDTO(): CartDTO {
    return {
      items: this.items.map((item) => item.transformToDTO()),
      totalQuantity: this.totalQuantity,
    };
  }
}
