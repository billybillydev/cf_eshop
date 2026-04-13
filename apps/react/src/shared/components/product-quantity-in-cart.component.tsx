import { useCartContext } from "$/pages/cart/hooks";
import { Button } from "$/shared/components/button.component";
import { CartItemEntity } from "@eshop/business/domain/entities";

export function ProductQuantityInCart({ item }: { item: CartItemEntity }) {
  const { updateItemQuantityInCart } = useCartContext();
  // const [quantity, setQuantity] = useState(item.quantity);

  return (
    <div className="flex gap-x-4 items-center">
      <Button
        variant="primary"
        onClick={async () => {
          await updateItemQuantityInCart(
            { id: item.product.id, name: item.product.name },
            item.quantity - 1
          );
          // setQuantity(newQuantity);
        }}
        text="-"
      />
      <span className="px-2">{item.quantity}</span>
      <Button
        variant="primary"
        onClick={async () => {
          await updateItemQuantityInCart(
            { id: item.product.id, name: item.product.name },
            item.quantity + 1
          );
          // setQuantity(newQuantity);
        }}
        text="+"
      />
    </div>
  );
}
