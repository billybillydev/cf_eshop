"use client";

import { useAuth } from "$pages/authentication/hooks";
import {
  ProductEntity,
  ProductItemEntity,
} from "@eshop/business/domain/entities";
import {
  GetProductByCodeUseCase,
  ShowProductsUseCase,
} from "@eshop/business/domain/usecases/product";
import { ProductPaginationParameters } from "@eshop/business/infrastructure/ports";
import qs from "qs";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductRepository } from "$infrastructure/repositories/product.repository";

export const useProductCode = (
  code: string
): {
  product: ProductEntity | null;
  loading: boolean;
  setProduct: Dispatch<SetStateAction<ProductEntity | null>>;
} => {
  const { token } = useAuth();

  const [product, setProduct] = useState<ProductEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const productRepository = useMemo(() => new ProductRepository(), []);

  useEffect(() => {
    productRepository.setToken(token);
  }, [token, productRepository]);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const getProductBySlugUseCase = new GetProductByCodeUseCase(
        productRepository
      );

      const res = await getProductBySlugUseCase.execute(code);

      setProduct(res);
      setLoading(false);
    }

    if (!product) {
      console.log("fetching product");
      fetchProduct();
    }
  }, [code, product, productRepository]);

  console.log("in useProductSlugHook : ", { product });

  return { product, loading, setProduct };
};

export const useDebounce = <T>(value: T, duration: number = 500): T => {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebounceValue(value);
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return debounceValue;
};

export const useProductsPagination = (): {
  loading: boolean;
  paginateParameterKey: (params: ProductPaginationParameters) => void;
} => {
  const { token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const [loading, setLoading] = useState(false);

  function paginateParameterKey(params: ProductPaginationParameters) {
    const qsParams = qs.stringify(params);
    router.push(`${pathname}${qsParams ? `?${qsParams}` : ""}`);
  }

  return { loading, paginateParameterKey };
};
