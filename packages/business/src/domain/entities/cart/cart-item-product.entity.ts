import { CartItemProductDTO } from "$domain/dtos/cart/cart-item-product.dto";
import { IdObject, PriceObject } from "$domain/value-objects";

export class CartItemProductEntity {
  readonly id: IdObject;
  readonly name: string;
  readonly code: string;
  readonly price: PriceObject;
  readonly image: string;

  constructor(cartItemProductData: {
    id: IdObject;
    name: string;
    code: string;
    price: PriceObject;
    image: string;
  }) {
    this.id = cartItemProductData.id;
    this.name = cartItemProductData.name;
    this.code = cartItemProductData.code;
    this.price = cartItemProductData.price;
    this.image = cartItemProductData.image;
  }

  transformToDTO(): CartItemProductDTO {
    return {
      id: this.id.value(),
      name: this.name,
      code: this.code,
      image: this.image,
      price: this.price.getValue(),
    };
  }

  static transformToEntity(
    product: CartItemProductDTO
  ): CartItemProductEntity {
    return new CartItemProductEntity({
      ...product,
      id: new IdObject(product.id),
      price: new PriceObject(product.price),
    });
  }
}
