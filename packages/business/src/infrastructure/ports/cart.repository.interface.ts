import type { CartEntity, CartItemEntity, CartItemProductEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";

export interface CartRepositoryInterface {
  getCart(): Promise<CartEntity>;
  addToCart(product: CartItemProductEntity, quantity?: number): Promise<CartEntity>;
  deleteItemFromCart(productId: IdObject): Promise<CartEntity>;
  updateItemQuantityInCart(productId: IdObject, quantity: number): Promise<CartEntity>;
  getCartItemByProductId(productId: IdObject): Promise<CartItemEntity | null>;
}
