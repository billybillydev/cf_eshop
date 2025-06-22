
import { CartList } from "$pages/cart/components";
import { useCartContext } from "$pages/cart/hooks";

export function CartPage() {
  const { cart, deleteItemFromCart } = useCartContext();

  return (
    <div className="space-y-4 container border p-2 rounded mx-auto lg:my-4">
      <h1 className="text-center">Cart</h1>
      <CartList items={cart?.items} deleteItemFromCart={deleteItemFromCart} />
      <p className="flex items-center justify-between text-xl font-semibold">
        <span>Total Quantity</span>
        <span>{cart.totalQuantity}</span>
      </p>
      <p className="flex items-center justify-between text-xl font-semibold">
        <span>Total Price</span>
        <span>{cart.calculateTotalPrice().toString()}</span>
      </p>
    </div>
  );
}
