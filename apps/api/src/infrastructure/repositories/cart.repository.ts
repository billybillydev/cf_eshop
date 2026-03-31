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
import { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export class CartApiRepository implements CartRepositoryInterface {
  private readonly cartCookieKey = "cart2";
  private cart!: CartEntity;
  private honoContext: Context;

  constructor(honoContext: Context, cartDTO?: CartDTO) {
    this.honoContext = honoContext;
    this.cart = cartDTO
      ? new CartEntity(cartDTO)
      : new CartEntity();
  }
  getCartItemByProductId(productId: IdObject): Promise<CartItemEntity | null> {
    throw new Error("Method not implemented.");
  }

  async getCart(): Promise<CartEntity> {
    const cartCookie = getCookie(this.honoContext, this.cartCookieKey);

    const cartData = cartCookie ? (JSON.parse(cartCookie) as CartDTO) : null;
    if (cartData) {
      this.cart = new CartEntity(cartData);
    }
    return Promise.resolve(this.cart);
  }

  async addToCart(
    product: CartItemProductEntity,
    quantity: number = 1
  ): Promise<CartEntity> {
    this.cart = await this.getCart();
    this.cart.addItem(product, quantity);

    const cartDTO = this.cart.transformToDTO();
    setCookie(this.honoContext, this.cartCookieKey, JSON.stringify(cartDTO));

    return Promise.resolve(this.cart);
  }

  async deleteItemFromCart(productId: IdObject): Promise<CartEntity> {
    this.cart = await this.getCart();

    this.cart.deleteItem(productId);

    if (this.cart.totalQuantity === 0) {
      deleteCookie(this.honoContext, this.cartCookieKey);
    } else {
      const cartDTO = this.cart.transformToDTO();
      setCookie(this.honoContext, this.cartCookieKey, JSON.stringify(cartDTO));
    }

    return Promise.resolve(this.cart);
  }

  async updateItemQuantityInCart(
    productId: IdObject,
    quantity: number
  ): Promise<CartEntity> {
    this.cart = await this.getCart();
    this.cart.updateItemQuantity(productId, quantity);

    const cartDTO = this.cart.transformToDTO();
    setCookie(this.honoContext, this.cartCookieKey, JSON.stringify(cartDTO));

    return Promise.resolve(this.cart);
  }
}
