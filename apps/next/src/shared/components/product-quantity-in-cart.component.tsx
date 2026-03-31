"use client";

import { useCartContext } from "$pages/cart/hooks";
import { Button } from "$shared/components/button.component";
import { CartItemEntity } from "@eshop/business/domain/entities";

export function ProductQuantityInCart({ item }: { item: CartItemEntity }) {
  const { updateItemQuantityInCart } = useCartContext();

  return (
    <div className="flex gap-x-4 items-center">
      <Button
      variant="primary"
        onClick={async () => {
          await updateItemQuantityInCart(
            { id: item.product.id, name: item.product.name },
            item.quantity - 1
          );
        }}
        disabled={item.quantity <= 1}
      >
        -
      </Button>
      <span className="px-8">{item.quantity}</span>
      <Button
      variant="primary"
        onClick={async () => {
          await updateItemQuantityInCart(
            { id: item.product.id, name: item.product.name },
            item.quantity + 1
          );
        }}
        disabled={item.quantity >= 10}
      >
        +
      </Button>
    </div>
  );
}
