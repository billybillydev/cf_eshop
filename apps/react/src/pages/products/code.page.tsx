import { ProductDetail } from "$pages/products/components";
import { useProductSlugHook } from "$pages/products/hooks";
import { Link, NavLink, useParams } from "react-router-dom";

export function ProductCodePage() {
  const { code } = useParams();

  if (!code) {
    return (
      <div className="container space-y-8 mx-auto flex items-center justify-center">
        <Link to="/">Back to list</Link>
        <p className="w-full h-full flex items-center justify-center">
          Oops, something went wrong
        </p>
      </div>
    );
  }

  const { product, loading } = useProductSlugHook(code);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Breadcrumb / Back */}
      <div className="flex items-center justify-between gap-3">
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to products
        </NavLink>
      </div>

      {/* Content */}
      {!loading && product && <ProductDetail item={product} />}
      {loading && (
        <p className="w-full h-full flex items-center justify-center">
          Loading...
        </p>
      )}
      {!loading && !product && (
        <p className="w-full h-full flex items-center justify-center">
          Product not found
        </p>
      )}
    </div>
  );
}
