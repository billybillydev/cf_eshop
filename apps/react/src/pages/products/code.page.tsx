
import { ProductDetail } from "$pages/products/components";
import { useProductSlugHook } from "$pages/products/hooks";
import { Link, useParams } from "react-router-dom";

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
    <div className="product-detail-container">
      <Link className="back-to-list-link" to="/">
        Back to list
      </Link>
      {loading && !product && (
        <p className="w-full h-full flex items-center justify-center">
          Loading...
        </p>
      )}
      {!loading && product && <ProductDetail item={product} />}
      {!loading && !product && (
        <p className="w-full h-full flex items-center justify-center">
          Product not found
        </p>
      )}
    </div>
  );
}
