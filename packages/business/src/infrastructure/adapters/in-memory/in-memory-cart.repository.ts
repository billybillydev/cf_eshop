import { CartEntity, CartItemEntity, CartItemProductEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import type { CartRepositoryInterface } from "$infrastructure/ports";

export class InMemoryCartRepository implements CartRepositoryInterface {
  private readonly cart: CartEntity = new CartEntity();

  async getCart(): Promise<CartEntity> {
    return Promise.resolve(this.cart);
  }

  async getCartItemByProductId(productId: IdObject): Promise<CartItemEntity | null> {
    return Promise.resolve(this.cart.items.find((item) => item.product.id.equals(productId)) ?? null);
  }

  async addToCart(
    product: CartItemProductEntity,
    quantity?: number
  ): Promise<CartEntity> {
    this.cart.addItem(product, quantity);

    return Promise.resolve(this.cart);
  }

  async deleteItemFromCart(productId: IdObject): Promise<CartEntity> {
    this.cart.deleteItem(productId);

    return Promise.resolve(this.cart);
  }

  async updateItemQuantityInCart(productId: IdObject, quantity: number): Promise<CartEntity> {
    this.cart.updateItemQuantity(productId, quantity);

    return Promise.resolve(this.cart);
  }
}
