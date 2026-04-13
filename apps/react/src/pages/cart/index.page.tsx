import { CartList, CartSummary, EmptyCart } from "$/pages/cart/components";
import { useCartContext } from "$/pages/cart/hooks";

export function CartPage() {
  const { cart, loading, deleteItemFromCart } = useCartContext();

  return (
    // <div className="space-y-4 container border p-2 rounded mx-auto lg:my-4">
    //   <h1 className="text-center">Cart</h1>
    //   <CartList items={cart?.items} deleteItemFromCart={deleteItemFromCart} />
    //   <p className="flex items-center justify-between text-xl font-semibold">
    //     <span>Total Quantity</span>
    //     <span>{cart.totalQuantity}</span>
    //   </p>
    //   <p className="flex items-center inset justify-between text-xl font-semibold">
    //     <span>Total Price</span>
    //     <span>{cart.calculateTotalPrice().toString()}</span>
    //   </p>
    // </div>
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Cart
          </h1>
          <p className="text-sm text-muted-foreground">
            Review items, adjust quantities, then checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground"
                onclick="document.documentElement.classList.toggle('dark')"
                title="Toggle dark mode"
              >
                Toggle theme
              </button> */}

          <a
            href="/"
            className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium
                       hover:bg-accent hover:text-accent-foreground"
          >
            Continue shopping
          </a>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading cart…</p>
        </div>
      ) : cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <CartList items={cart.items} deleteItemFromCart={deleteItemFromCart} />
          <CartSummary cart={cart} />
        </section>
      )}
    </div>
  );
}
