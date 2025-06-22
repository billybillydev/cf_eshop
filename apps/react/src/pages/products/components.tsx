import { DEFAULT_PAGE } from "$config/variables";
import { useCartContext } from "$pages/cart/hooks";
import { useCategoryList } from "$pages/category/hooks";
import { ProductQuantityInCart } from "$shared/components/product-quantity-in-cart.component";
import {
  CartItemEntity,
  CartItemProductEntity,
  CategoryEntity,
  ProductEntity,
  ProductItemEntity,
} from "@eshop/business/domain/entities";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function ProductList({ items }: { items: ProductItemEntity[] }) {
  const { addToCart } = useCartContext();

  async function addProductToCart(product: CartItemProductEntity) {
    addToCart(product);
  }

  return (
    <>
      {items.length ? (
        <ul className="product-list">
          {items.map((item) => {
            return (
              <ProductItem
                key={item.id.value()}
                item={item}
                addProductToCart={addProductToCart}
              />
            );
          })}
        </ul>
      ) : (
        <p className="no-products-text">There is no product</p>
      )}
    </>
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
    <li className="product-item">
      <img src={`${item.image}/thumbnail`} alt={item.name} />
      <div className="product-info">
        <p className="name-and-price">
          <span>{item.name}</span>
          <span>{item.price.toString()}</span>
        </p>
        <div className="category-and-supplier-info">
          <section>
            <span>Category:</span>
            <span>{item.category.name}</span>
          </section>
        </div>
        <div className="buttons-action">
          <Link className="btn btn-primary" to={`/${item.code}`}>
            Show More
          </Link>
          {cartItemEntity ? (
            <ProductQuantityInCart item={cartItemEntity} />
          ) : null}
          {!cartItemEntity && item.inventoryStatus === "OUTOFSTOCK" ? (
            <button className="btn btn-secondary" disabled>
              Out of stock
            </button>
          ) : null}
          {!cartItemEntity && item.inventoryStatus !== "OUTOFSTOCK" ? (
            <button
              className="btn btn-secondary"
              onClick={() =>
                addProductToCart(
                  new CartItemProductEntity({
                    id: item.id,
                    name: item.name,
                    code: item.code,
                    image: item.image,
                    price: item.price,
                  })
                )
              }
            >
              Add to Cart
            </button>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function ProductDetail({
  item,
}: {
  item: Omit<ProductEntity, "equals">;
}) {
  const { addToCart, getCartItemByProductId, cart } =
    useCartContext();
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
    <div className="product-detail">
      <img src={item.image} alt={item.name} className="aspect-square" />
      <section>
        <h1 className="name-and-price">
          <span>{item.name}</span>
          <span>{item.price.toString()}</span>
        </h1>
        <div className="category-and-supplier-info">
          <div>
            <span>Category:</span>
            <span>{item.category.name}</span>
          </div>
        </div>
        <p>
          <span>Description:</span> <span>{item.description}</span>
        </p>
        <p>
          <span>Internal Reference:</span> <span>{item.internalReference}</span>
        </p>
        <p>
          <span>Inventory Status:</span> <span>{item.inventoryStatus}</span>
        </p>
        <div className="mx-auto flex justify-center">
          {cartItemEntity ? (
            <ProductQuantityInCart item={cartItemEntity} />
          ) : null}
          {!cartItemEntity && item.inventoryStatus === "OUTOFSTOCK" ? (
            <button className="btn btn-secondary" disabled>
              Out of stock
            </button>
          ) : null}
          {!cartItemEntity && item.inventoryStatus !== "OUTOFSTOCK" ? (
            <button
              className="btn btn-primary w-full"
              onClick={() =>
                addToCart(
                  new CartItemProductEntity({
                    id: item.id,
                    name: item.name,
                    code: item.code,
                    price: item.price,
                    image: item.image,
                  })
                )
              }
            >
              Add to Cart
            </button>
          ) : null}
        </div>
      </section>
    </div>
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

  return (
    <section>
      {loading && !categories.length ? (
        <div>
          <span>Loading supplier filters...</span>
        </div>
      ) : null}
      {!loading && categories.length ? (
        <select
          name="category"
          id="categories"
          className="product-filter-select"
          defaultValue={categoryFilter || items[0].value}
          onChange={(event) => setCategoryFilter(event.target.value)}
        >
          <option value="">Filter by Category</option>
          {categories.map((category) => (
            <option key={category.id.value()} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      ) : null}
    </section>
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
    <div className="flex gap-x-3 items-center justify-center p-2">
      <button
        disabled={selectedPage <= DEFAULT_PAGE}
        className="btn btn-secondary"
        onClick={() => selectPage(1)}
      >
        First
      </button>
      <button
        disabled={selectedPage <= DEFAULT_PAGE}
        className="btn btn-secondary"
        onClick={() => selectPage(selectedPage - 1)}
      >
        Previous
      </button>
      <div className="px-2 flex gap-x-2">
        <select
          name="select"
          id="select"
          className="text-foreground"
          value={String(selectedPage)}
          onChange={(event: { target: { value: string } }) =>
            selectPage(Number(event.target.value))
          }
        >
          {Array.from({ length: pages }, (_, index) => (
            <option key={index} value={String(index + 1)}>
              {String(index + 1)}
            </option>
          ))}
        </select>
        <span>/ {pages}</span>
      </div>
      <button
        disabled={selectedPage >= pages}
        className="btn btn-secondary"
        onClick={() => selectPage(selectedPage + 1)}
      >
        Next
      </button>
      <button
        disabled={selectedPage >= pages}
        className="btn btn-secondary"
        onClick={() => selectPage(pages)}
      >
        Last
      </button>
    </div>
  );
}
