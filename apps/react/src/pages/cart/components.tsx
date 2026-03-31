import { ProductQuantityInCart } from "$shared/components/product-quantity-in-cart.component";
import {
  CartEntity,
  CartItemEntity,
  CartItemProductEntity,
} from "@eshop/business/domain/entities";
import { PriceObject } from "@eshop/business/domain/value-objects";
import { Link } from "react-router-dom";

export function CartList({
  items,
  deleteItemFromCart,
}: {
  items: CartItemEntity[];
  deleteItemFromCart(product: CartItemProductEntity): Promise<void>;
}) {
  async function removeItem(product: CartItemProductEntity) {
    if (window.confirm(`Remove ${product.name} from cart ?`)) {
      deleteItemFromCart(product);
    }
  }

  return (
    <ul className="lg:col-span-2 space-y-4">
      {/* Item */}
      {items.map((item) => (
        <li key={item.product.id.value()}>
          <article className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 flex gap-4 sm:gap-5">
              <Link to={`/product/${item.product.code}`} className="shrink-0">
                <img
                  alt={item.product.name}
                  src={item.product.image}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl object-cover bg-muted border border-border"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      to={`/product/${item.product.code}`}
                      className="font-medium leading-tight hover:underline line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <div className="mt-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                        {item.product.category.name}
                      </span>
                      <span className="mx-2 opacity-60">•</span>
                      <span>{item.product.inventoryStatus}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold">
                      {item.product.price.toString()}
                    </div>
                    {/* <div className="text-xs text-muted-foreground">
                      {item.product.price.getValue().toFixed(2)} each
                    </div> */}
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  {/* Quantity control */}
                  <ProductQuantityInCart item={item} />
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Line total:</span>
                      <span className="ml-2 font-medium">
                        {new PriceObject(
                          item.product.price.getValue() * item.quantity
                        ).toString()}
                      </span>
                    </div>
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-destructive px-4 text-sm font-medium
                                   text-destructive-foreground hover:opacity-95"
                      onClick={() => removeItem(item.product)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </li>
      ))}

      {/* Note / empty-state hint */}
      {/* <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Tip: sync filters & cart state to the URL/localStorage to show
        “fullstack polish”.
      </div> */}
    </ul>
  );
}

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
      <div className="text-6xl">🛒</div>
      <h2 className="text-xl font-semibold tracking-tight">
        Your cart is empty
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        Looks like you haven't added anything yet. Browse our products and find
        something you love!
      </p>
      <Link
        to="/"
        className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium
                   text-primary-foreground shadow-sm hover:opacity-95 focus:ring-2 ring-ring"
      >
        Browse products
      </Link>
    </div>
  );
}

export function CartSummary({ cart }: { cart: CartEntity }) {
  const totalPrice = cart.calculateTotalPrice().toString();

  return (
    <aside className="lg:sticky lg:top-20 space-y-4">
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">
            Order summary
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">{cart.items.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{totalPrice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Taxes</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-semibold tracking-tight">
              {totalPrice}
            </span>
          </div>

          <Link
            to="/checkout"
            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium
                       text-primary-foreground shadow-sm hover:opacity-95 focus:ring-2 ring-ring"
          >
            Checkout
          </Link>

          <button
            className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-border bg-card px-4 text-sm font-medium
                       hover:bg-accent hover:text-accent-foreground"
          >
            Apply coupon
          </button>

          <p className="text-xs text-muted-foreground">
            By checking out, you agree to our terms. (This is great for showing
            "real app" attention to detail.)
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        Need help?{" "}
        <a href="/contact" className="text-foreground hover:underline">
          Contact support
        </a>
      </div>
    </aside>
  );
}
