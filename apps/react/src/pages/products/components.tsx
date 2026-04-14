import { DEFAULT_PAGE } from "$/config/variables";
import { useCartContext } from "$/pages/cart/hooks";
import { useCategoryList } from "$/pages/category/hooks";
import { Button } from "$/shared/components/button.component";
import { ProductQuantityInCart } from "$/shared/components/product-quantity-in-cart.component";
import { useFavorite } from "$/pages/account/favorites/favorite.hooks";
import {
  CartItemEntity,
  CartItemProductEntity,
  CategoryEntity,
  ProductEntity,
  ProductItemEntity,
} from "@eshop/business/domain/entities";
import { FavoriteVO } from "@eshop/business/domain/value-objects";
import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function ProductList({ items }: { items: ProductItemEntity[] }) {
  const { addToCart } = useCartContext();

  async function addProductToCart(product: CartItemProductEntity) {
    addToCart(product);
  }

  return items.length ? (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((product) => (
        <ProductItem
          key={product.id.value()}
          item={product}
          addProductToCart={addProductToCart}
        />
      ))}
    </ul>
  ) : (
    <p className="text-center py-12 text-muted-foreground">No products found</p>
  );
}

export function ProductItem({
  item,
  addProductToCart,
}: {
  item: Omit<ProductItemEntity, "equals">;
  addProductToCart: (product: CartItemProductEntity) => Promise<void>;
}) {
  const { getCartItemByProductId, cart } = useCartContext();
  const [cartItemEntity, setCartItemEntity] = useState<CartItemEntity | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const cartItem = await getCartItemByProductId(item.id);
      setCartItemEntity(cartItem);
    })();
  }, [item, cart.items]);

  return (
    <li>
      <article
        key={item.id.value()}
        className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:shadow-md"
      >
        <div className="relative aspect-[4/3] bg-muted">
          <img
            alt={item.code}
            className="h-full w-full object-cover"
            src={item.image}
          />
          {/* <span
                          className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          NEW
                        </span> */}
        </div>
        <div className="p-4 space-y-2">
          <div className="space-y-1">
            <h3 className="font-medium leading-tight line-clamp-1">
              {item.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              Category: {item.category.name}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span>★ {item.rating}</span>
              {/* <span className="text-muted-foreground/70">({item.reviewsCount})</span> */}
            </div>
            <div className="font-semibold">${item.price.getValue()}</div>
          </div>
          <div className="pt-2 flex items-center justify-between gap-2">
            {cartItemEntity ? (
              <ProductQuantityInCart item={cartItemEntity} />
            ) : null}

            {!cartItemEntity && item.inventoryStatus === "OUTOFSTOCK" ? (
              <Button disabled text="Out of stock" />
            ) : null}

            {!cartItemEntity && item.inventoryStatus !== "OUTOFSTOCK" ? (
              <Button
                variant="primary"
                onClick={() =>
                  addProductToCart(
                    new CartItemProductEntity({
                      id: item.id.value(),
                      name: item.name,
                      code: item.code,
                      price: item.price.getValue(),
                      image: item.image,
                      category: item.category.transformToDTO(),
                      inventoryStatus: item.inventoryStatus,
                    })
                  )
                }
                text="Add to cart"
              />
            ) : null}

            <Link
              to={`/products/${item.code}`}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Details
            </Link>
          </div>
        </div>
      </article>
    </li>
  );
}

export function ProductDetail({
  item,
}: {
  item: Omit<ProductEntity, "equals">;
}) {
  const { addToCart, getCartItemByProductId, cart } = useCartContext();
  const { add, remove, isProductInFavorites } = useFavorite();

  const [cartItemEntity, setCartItemEntity] = useState<CartItemEntity | null>(
    null
  );

  async function toggleFavorite() {
    if (isProductInFavorites(item.id)) {
      await remove(item.id, item.name);
    } else {
      await add(
        new FavoriteVO({
          productId: item.id.value(),
          productCode: item.code,
          productName: item.name,
          productImage: item.image,
          inventoryStatus: item.inventoryStatus,
        })
      );
    }
  }

  useEffect(() => {
    (async () => {
      const cartItem = await getCartItemByProductId(item.id);
      setCartItemEntity(cartItem);
    })();
  }, [item, cart.items]);

  return (
    // <div className="product-detail">
    //   <img src={item.image} alt={item.name} className="aspect-square" />
    //   <section>
    //     <h1 className="name-and-price">
    //       <span>{item.name}</span>
    //       <span>{item.price.toString()}</span>
    //     </h1>
    //     <div className="category-and-supplier-info">
    //       <div>
    //         <span>Category:</span>
    //         <span>{item.category.name}</span>
    //       </div>
    //     </div>
    //     <p>
    //       <span>Description:</span> <span>{item.description}</span>
    //     </p>
    //     <p>
    //       <span>Internal Reference:</span> <span>{item.internalReference}</span>
    //     </p>
    //     <p>
    //       <span>Inventory Status:</span> <span>{item.inventoryStatus}</span>
    //     </p>
    //     <div className="mx-auto flex justify-center">
    //       {cartItemEntity ? (
    //         <ProductQuantityInCart item={cartItemEntity} />
    //       ) : null}
    //       {!cartItemEntity && item.inventoryStatus === "OUTOFSTOCK" ? (
    //         <button className="btn btn-secondary" disabled>
    //           Out of stock
    //         </button>
    //       ) : null}
    //       {!cartItemEntity && item.inventoryStatus !== "OUTOFSTOCK" ? (
    //         <button
    //           className="btn btn-primary w-full"
    //           onClick={() =>
    //             addToCart(
    //               new CartItemProductEntity({
    //                 id: item.id.value(),
    //                 name: item.name,
    //                 code: item.code,
    //                 price: item.price.getValue(),
    //                 image: item.image,
    //               })
    //             )
    //           }
    //         >
    //           Add to Cart
    //         </button>
    //       ) : null}
    //     </div>
    //   </section>
    // </div>
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
      {/* Gallery */}
      <div className="space-y-3">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
          <div className="relative aspect-square">
            <img
              alt={item.code}
              className="absolute inset-0 h-full w-full object-cover"
              src={item.image}
            />
          </div>
        </div>

        {/* Thumbnails (optional) */}
        {/* <div className="grid grid-cols-4 gap-2">
          <button className="overflow-hidden rounded-xl border border-border bg-muted hover:opacity-95">
            <img
              alt="Thumbnail 1"
              className="aspect-square w-full object-cover"
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
            />
          </button>
          <button className="overflow-hidden rounded-xl border border-border bg-muted hover:opacity-95">
            <img
              alt="Thumbnail 2"
              className="aspect-square w-full object-cover"
              src="https://images.unsplash.com/photo-1528701800489-20be3c1ea3c9?auto=format&fit=crop&w=600&q=80"
            />
          </button>
          <button className="overflow-hidden rounded-xl border border-border bg-muted hover:opacity-95">
            <img
              alt="Thumbnail 3"
              className="aspect-square w-full object-cover"
              src="https://images.unsplash.com/photo-1520975958225-403f0fbe5f0a?auto=format&fit=crop&w=600&q=80"
            />
          </button>
          <button className="overflow-hidden rounded-xl border border-border bg-muted hover:opacity-95">
            <img
              alt="Thumbnail 4"
              className="aspect-square w-full object-cover"
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80"
            />
          </button>
        </div> */}
      </div>

      {/* Details card */}
      <div className="lg:pt-2">
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="p-6 space-y-5">
            {/* Title + price */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                    {item.category.name}
                  </span>
                  {/* <span className="text-xs text-muted-foreground">
                    SKU: HS-2041
                  </span> */}
                </div>

                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  {item.name}
                </h1>

                <div className="text-sm text-muted-foreground">
                  <span>★ {item.rating}</span>
                  {/* <span className="opacity-70">(120 reviews)</span> • */}
                  {/* <span className="font-medium text-foreground">In stock</span> */}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-semibold tracking-tight">
                  ${item.price.getValue()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Tax included
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-sm font-medium">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground">
                  Internal reference
                </div>
                <div className="text-sm font-medium">
                  {item.internalReference}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs text-muted-foreground">
                  Inventory status
                </div>
                <div className="text-sm font-medium">
                  {item.inventoryStatus}
                </div>
              </div>
            </div>

            {/* Quantity + actions */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg bg-background w-full sm:w-auto">
                {cartItemEntity ? (
                  <ProductQuantityInCart item={cartItemEntity} />
                ) : null}

                {!cartItemEntity && item.inventoryStatus === "OUTOFSTOCK" ? (
                  <Button disabled text="Out of stock" />
                ) : null}

                {!cartItemEntity && item.inventoryStatus !== "OUTOFSTOCK" ? (
                  <Button
                    variant="primary"
                    onClick={() =>
                      addToCart(
                        new CartItemProductEntity({
                          id: item.id.value(),
                          name: item.name,
                          code: item.code,
                          price: item.price.getValue(),
                          image: item.image,
                          category: item.category.transformToDTO(),
                          inventoryStatus: item.inventoryStatus,
                        })
                      )
                    }
                    text="Add to cart"
                  />
                ) : null}

                <button
                  className={clsx(
                    "inline-flex h-10 items-center justify-center rounded-lg border  px-4 text-sm font-medium",
                    "hover:bg-accent hover:text-accent-foreground",
                    isProductInFavorites(item.id)
                      ? "bg-accent text-accent-foreground border-transparent"
                      : "border-border bg-card"
                  )}
                  onClick={toggleFavorite}
                >
                  {isProductInFavorites(item.id) ? "Saved" : "Save"}
                </button>
              </div>

              {/* Divider */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Free returns within 30 days</span>
                  <a href="/contact" className="hover:text-foreground">
                    Need help?
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Optional: related products */}
          <div className="mt-6 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Related products</h2>
              <a
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View all
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a
                href="#"
                className="rounded-xl border border-border bg-card p-3 hover:bg-accent"
              >
                <div className="text-sm font-medium line-clamp-1">
                  Cotton Socks
                </div>
                <div className="text-xs text-muted-foreground">$12.00</div>
              </a>
              <a
                href="#"
                className="rounded-xl border border-border bg-card p-3 hover:bg-accent"
              >
                <div className="text-sm font-medium line-clamp-1">
                  Leather Belt
                </div>
                <div className="text-xs text-muted-foreground">$49.00</div>
              </a>
              <a
                href="#"
                className="rounded-xl border border-border bg-card p-3 hover:bg-accent"
              >
                <div className="text-sm font-medium line-clamp-1">
                  Daily Sneakers
                </div>
                <div className="text-xs text-muted-foreground">$89.00</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductFilterByCategory({
  categoryFilter,
  setCategoryFilter,
}: {
  categoryFilter: CategoryEntity["name"];
  setCategoryFilter: Dispatch<SetStateAction<CategoryEntity["name"]>>;
}) {
  const { categories, loading } = useCategoryList();

  const items = [
    { value: "", label: "Filter by Category" },
    ...categories.map((category) => ({
      value: category.name,
      label: category.name,
    })),
  ];

  return !loading && categories.length ? (
    <select
      className="h-10 rounded-lg border border-border bg-background px-3 text-sm shadow-sm focus:ring-2 ring-ring"
      defaultValue={categoryFilter || items[0].value}
      onChange={(event) => setCategoryFilter(event.target.value)}
    >
      <option value="">Category: All</option>
      {categories.map((category) => (
        <option key={category.id.value()} value={category.name}>
          {category.name}
        </option>
      ))}
    </select>
  ) : null;
}

export function Filters({
  categoryFilter,
  setCategoryFilter,
}: {
  categoryFilter: CategoryEntity["name"];
  setCategoryFilter: Dispatch<SetStateAction<CategoryEntity["name"]>>;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <ProductFilterByCategory
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <select className="h-10 rounded-lg border border-border bg-background px-3 text-sm shadow-sm focus:ring-2 ring-ring">
        <option>Sort: Newest</option>
        <option>Price: Low → High</option>
        <option>Price: High → Low</option>
      </select>

      <button
        type="button"
        className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm font-medium text-secondary-foreground shadow-sm hover:opacity-95"
      >
        Filters
      </button>
    </div>
  );
}

export type PaginationProps = {
  pages: number;
  selectedPage?: number;
  selectPage: (page: number) => void;
};

export function Pagination({
  pages,
  selectedPage = 1,
  selectPage,
}: PaginationProps) {
  return (
    <>
      <Button
        disabled={selectedPage <= DEFAULT_PAGE}
        onClick={() => selectPage(1)}
        text="First"
      />
      <Button
        disabled={selectedPage <= DEFAULT_PAGE}
        onClick={() => selectPage(selectedPage - 1)}
        text="Prev"
      />
      <div className="text-sm text-muted-foreground px-2 flex items-center gap-x-2 relative">
        <select
          name="select"
          id="select"
          className="font-medium text-foreground input"
          value={String(selectedPage)}
          onChange={(event: { target: { value: string } }) =>
            selectPage(Number(event.target.value))
          }
        >
          {Array.from({ length: pages }, (_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        <span className="shrink-0">of {pages}</span>
      </div>
      <Button
        disabled={selectedPage >= pages}
        onClick={() => selectPage(selectedPage + 1)}
        text="Next"
      />
      <Button
        disabled={selectedPage >= pages}
        onClick={() => selectPage(pages)}
        text="Last"
      />
    </>
  );
}
