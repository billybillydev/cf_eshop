import { useCartContext } from "$pages/cart/hooks";
import { CartItemEntity } from "@eshop/business/domain/entities";
import { useState } from "react";

export function ProductQuantityInCart({ item }: { item: CartItemEntity }) {
  const { updateItemQuantityInCart } = useCartContext();
  // const [quantity, setQuantity] = useState(item.quantity);

  return (
    <div className="flex gap-x-4 items-center">
      <button
        className="btn btn-secondary p-4 rounded"
        onClick={async () => {
          await updateItemQuantityInCart(
            { id: item.product.id, name: item.product.name },
            item.quantity - 1
          );
          // setQuantity(newQuantity);
        }}
      >
        -
      </button>
      <span className="px-8">{item.quantity}</span>
      <button
        className="btn btn-secondary p-4 rounded"
        onClick={async () => {
          await updateItemQuantityInCart(
            { id: item.product.id, name: item.product.name },
            item.quantity + 1
          );
          // setQuantity(newQuantity);
        }}
      >
        +
      </button>
    </div>
  );
}
