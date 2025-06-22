import { CartItemDTO } from "$domain/dtos/cart/cart-item.dto";

export type CartDTO = {
  items: CartItemDTO[];
  totalQuantity: number;
};
