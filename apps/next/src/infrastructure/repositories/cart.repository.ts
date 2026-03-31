import { CartDTO } from "@eshop/business/domain/dtos";
import {
  CartEntity,
  CartItemEntity,
  CartItemProductEntity,
} from "@eshop/business/domain/entities";
import { IdObject } from "@eshop/business/domain/value-objects";
import { CartRepositoryInterface } from "@eshop/business/infrastructure/ports";

export class CartRepository implements CartRepositoryInterface {
  private readonly cartCookieKey = "cart";
  private cart!: CartEntity;

  constructor(cartDTO?: CartDTO) {
    this.cart = cartDTO ? new CartEntity(cartDTO) : new CartEntity();
  }

  async getCart(): Promise<CartEntity> {
    const cartCookie = localStorage.getItem(this.cartCookieKey);
    const cartData = cartCookie ? (JSON.parse(cartCookie) as CartDTO) : null;
    if (cartData) {
      this.cart = new CartEntity(cartData);
    }
    return Promise.resolve(this.cart);
  }

  async getCartItemByProductId(
    productId: IdObject
  ): Promise<CartItemEntity | null> {
    this.cart = await this.getCart();
    return Promise.resolve(
      this.cart.items.find((item) => item.product.id.equals(productId)) ?? null
    );
  }

  async addToCart(
    product: CartItemProductEntity,
    quantity: number = 1
  ): Promise<CartEntity> {
    this.cart = await this.getCart();
    this.cart.addItem(product, quantity);

    const cartDTO = this.cart.transformToDTO();

    localStorage.setItem(this.cartCookieKey, JSON.stringify(cartDTO));

    return Promise.resolve(this.cart);
  }

  async deleteItemFromCart(productId: IdObject): Promise<CartEntity> {
    this.cart = await this.getCart();

    this.cart.deleteItem(productId);

    if (this.cart.totalQuantity === 0) {
      localStorage.removeItem(this.cartCookieKey);
    } else {
      const cartDTO = this.cart.transformToDTO();
      localStorage.setItem(this.cartCookieKey, JSON.stringify(cartDTO));
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

    localStorage.setItem(this.cartCookieKey, JSON.stringify(cartDTO));

    return Promise.resolve(this.cart);
  }
}
