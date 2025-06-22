import { DEFAULT_LIMITS, DEFAULT_PAGE } from "$config/variables";
import {
  Pagination,
  ProductFilterByCategory,
  ProductList,
} from "$pages/products/components";
import { useDebounce, useProductsPagination } from "$pages/products/hooks";
import { CategoryEntity, ProductEntity } from "@eshop/business/domain/entities";
import { ProductPaginationParameters } from "@eshop/business/infrastructure/ports";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function ProductsPage() {
  const [searchParams] = useSearchParams();

  const { products, total, loading, paginateParameterKey } =
    useProductsPagination();

  const [searchTerm, setSearchTerm] = useState<ProductEntity["name"]>(
    searchParams.get("productName") ?? ""
  );
  const [categoryFilter, setCategoryFilter] = useState<CategoryEntity["name"]>(
    searchParams.get("category") ?? ""
  );
  const debounceValue = useDebounce(searchTerm);
  const [page, setPage] = useState<number>(
    searchParams.get("page") ? Number(searchParams.get("page")) : DEFAULT_PAGE
  );
  const [limit, setLimit] = useState(
    searchParams.get("limit") &&
      DEFAULT_LIMITS.includes(Number(searchParams.get("limit")))
      ? Number(searchParams.get("limit"))
      : DEFAULT_LIMITS[0]
  );

  function handleSearchTerm(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  useEffect(() => {
    const filters: ProductPaginationParameters = {};

    if (categoryFilter) {
      filters.category = categoryFilter;
    }

    if (debounceValue) {
      filters.productName = debounceValue;
    }

    if (page) {
      filters.page = page;
    }

    if (limit) {
      filters.limit = limit;
    }

    if (Object.keys(filters).length) {
      paginateParameterKey(filters);
    }
  }, [categoryFilter, debounceValue, page, limit]);

  return (
    <div className="align-col">
      <h1 className="page-title">List of products</h1>
      <div className="product-filters-container">
        <input
          type="text"
          className="search-term-input"
          name="productSearch"
          placeholder="Search product by typing here"
          onChange={(e) => handleSearchTerm(e)}
          value={searchTerm}
        />
        <div className="filters-container">
          <ProductFilterByCategory
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </div>
      </div>
      {searchTerm ? (
        <p className="text-center">
          {products.length} found for searched term{" "}
          <em className={"italic font-bold"}>"{searchTerm}"</em>.
        </p>
      ) : null}
      <div className="container mx-auto p-2">
        {!loading ? <ProductList items={products} /> : null}
        {total > limit ? (
          <Pagination
            pages={Math.ceil(total / limit)}
            selectPage={(value: number) => {
              setPage(value);
            }}
            selectedPage={page}
          />
        ) : null}
        {loading && !products.length && (
          <div className="h-full w-full flex flex-col items-center justify-center">
            <p className="grow">Loading ...</p>
          </div>
        )}
      </div>
    </div>
  );
}
