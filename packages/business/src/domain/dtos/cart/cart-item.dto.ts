import { CartItemProductDTO } from "$domain/dtos/cart/cart-item-product.dto";

export type CartItemDTO = {
  product: CartItemProductDTO;
  quantity: number;
};
