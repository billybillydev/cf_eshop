import {
  CartDTO,
} from "@eshop/business/domain/dtos";
import {
  CartEntity,
  CartItemEntity,
  CartItemProductEntity
} from "@eshop/business/domain/entities";
import { IdObject } from "@eshop/business/domain/value-objects";
import { CartRepositoryInterface } from "@eshop/business/infrastructure/ports";

export class CartRepository implements CartRepositoryInterface {
  private cart!: CartEntity;
  private token?: string;

  constructor(token?: string) {
    this.cart = new CartEntity();
    this.token = token;
  }

  private get headers(): HeadersInit {
    const h: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (this.token) {
      h["Authorization"] = `Bearer ${this.token}`;
    }
    return h;
  }

  private async syncToKV(): Promise<void> {
    const cartDTO = this.cart.transformToDTO();
    if (this.cart.totalQuantity === 0) {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: this.headers,
        credentials: "include",
      });
    } else {
      await fetch("/api/cart", {
        method: "PUT",
        headers: this.headers,
        credentials: "include",
        body: JSON.stringify(cartDTO),
      });
    }
  }

  async getCart(): Promise<CartEntity> {
    const res = await fetch("/api/cart", {
      headers: this.headers,
      credentials: "include",
    });
    const cartData = (await res.json()) as CartDTO;
    this.cart = new CartEntity(cartData);
    return this.cart;
  }

  async getCartItemByProductId(productId: IdObject): Promise<CartItemEntity | null> {
    this.cart = await this.getCart();
    return this.cart.items.find((item) => item.product.id.equals(productId)) ?? null;
  }

  async addToCart(
    product: CartItemProductEntity,
    quantity: number = 1
  ): Promise<CartEntity> {
    this.cart = await this.getCart();
    this.cart.addItem(product, quantity);
    await this.syncToKV();
    return this.cart;
  }

  async deleteItemFromCart(productId: IdObject): Promise<CartEntity> {
    this.cart = await this.getCart();
    this.cart.deleteItem(productId);
    await this.syncToKV();
    return this.cart;
  }

  async updateItemQuantityInCart(
    productId: IdObject,
    quantity: number
  ): Promise<CartEntity> {
    this.cart = await this.getCart();
    this.cart.updateItemQuantity(productId, quantity);
    await this.syncToKV();
    return this.cart;
  }
}
