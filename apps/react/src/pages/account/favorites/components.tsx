import { Button } from "$/shared/components/button.component";
import { FavoriteVO } from "@eshop/business/domain/value-objects";
import clsx from "clsx";
import { Link } from "react-router-dom";

const inventoryStatusStyles: Record<string, string> = {
  INSTOCK: "bg-green-100 text-green-800",
  LOWSTOCK: "bg-yellow-100 text-yellow-800",
  OUTOFSTOCK: "bg-red-100 text-red-800",
};

const inventoryStatusLabels: Record<string, string> = {
  INSTOCK: "In Stock",
  LOWSTOCK: "Low Stock",
  OUTOFSTOCK: "Out of Stock",
};

export function FavoriteItem({
  favorite,
  onRemove,
}: {
  favorite: FavoriteVO;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={favorite.productImage}
          alt={favorite.productName}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-sm font-medium leading-tight truncate">
          <a
            href={`/products/${favorite.productCode}`}
            className="hover:underline"
          >
            {favorite.productName}
          </a>
        </h3>
        <span
          className={clsx(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            inventoryStatusStyles[favorite.inventoryStatus] ??
              "bg-muted text-muted-foreground"
          )}
        >
          {inventoryStatusLabels[favorite.inventoryStatus] ??
            favorite.inventoryStatus}
        </span>
      </div>

      <Button variant="destructive" onClick={onRemove} text="Remove" />
    </li>
  );
}

export function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 rounded-2xl border border-dashed border-border bg-card">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        className="text-muted-foreground/40"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-sm text-muted-foreground">
        You have no favorites yet.
      </p>
      <Link
        to="/"
        className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
      >
        Browse products
      </Link>
    </div>
  );
}
