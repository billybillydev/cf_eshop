"use client";

import { DEFAULT_LIMITS, DEFAULT_PAGE } from "$config/variables";
import { Filters, Pagination, ProductList } from "$pages/products/components";
import { useDebounce, useProductsPagination } from "$pages/products/hooks";
import { ProductItemDTO } from "@eshop/business/domain/dtos";
import {
  CategoryEntity,
  ProductEntity,
  ProductItemEntity
} from "@eshop/business/domain/entities";
import { ProductPaginationParameters } from "@eshop/business/infrastructure/ports";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export function ProductsPage({
  products,
  total,
}: {
  products: ProductItemDTO[];
  total: number;
}) {
  const productItemEntities = products.map((product) => new ProductItemEntity(product));
  const searchParams = useSearchParams() ?? new URLSearchParams();

  const { loading, paginateParameterKey } = useProductsPagination();

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

  const pages = Math.ceil(total / limit);

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
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      {/* Title block */}
      <section className="space-y-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Products
            </h1>
            <p className="text-sm text-muted-foreground">
              Browse the catalog. Search, filter, and add items to your cart.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{total}</span> items
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Search */}
          <div className="relative w-full md:max-w-xl">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-80"
              >
                <path
                  d="M21 21l-4.3-4.3m1.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              className="h-10 w-full rounded-lg border border-border bg-background px-10 text-sm shadow-sm placeholder:text-muted-foreground focus:ring-2 ring-ring"
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => handleSearchTerm(e)}
              type="search"
            />
          </div>

          <Filters
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </div>

        {/* <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">Active:</span>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                Kids
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                Sale
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6 6 18M6 6l12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="ml-1 inline-flex items-center rounded-full px-3 py-1 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Clear all
              </button>
            </div> */}
      </section>

      <section>
        {loading ? <div>Loading...</div> : <ProductList items={productItemEntities} />}
      </section>

      <section className="flex items-center justify-center gap-2 pt-2">
        {/* <button className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          ← Prev
        </button>
        <div className="text-sm text-muted-foreground">
          Page <span className="font-medium text-foreground">1</span> of 12
        </div>
        <button className="inline-flex h-9 items-center rounded-lg border border-border bg-card px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          Next →
        </button> */}
        {pages > 0 ? (
          <Pagination
            pages={pages}
            selectedPage={page}
            selectPage={(value: number) => setPage(value)}
          />
        ) : null}
      </section>
    </div>
  );
}
