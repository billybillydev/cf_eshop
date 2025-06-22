import { ProductRepository } from "$infrastructure/repositories/product.repository";
import { useAuth } from "$pages/authentication/hooks";
import {
  ProductEntity,
  ProductItemEntity,
} from "@eshop/business/domain/entities";
import {
  GetProductByCodeUseCase,
  ShowProductsUseCase,
} from "@eshop/business/domain/usecases/product";
import {
  ProductFilterParameters,
  ProductPaginationParameters,
} from "@eshop/business/infrastructure/ports";
import qs from "qs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useProductListHook = (): {
  products: ProductItemEntity[];
  loading: boolean;
  setProducts: Dispatch<SetStateAction<ProductItemEntity[]>>;
} => {
  const { token } = useAuth();

  const [searchParams, _] = useSearchParams();
  const [products, setProducts] = useState<ProductItemEntity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const productRepository = new ProductRepository();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      let res: ProductItemEntity[] = [];
      productRepository.setToken(token);
      const showProductUseCase = new ShowProductsUseCase(productRepository);

      if (searchParams.size) {
        const filters: ProductFilterParameters = {};

        if (searchParams.has("category")) {
          filters.category = searchParams.get("category") ?? "";
        }
        if (searchParams.has("supplier")) {
          filters.category = searchParams.get("supplier") ?? "";
        }
        if (searchParams.has("productName")) {
          filters.category = searchParams.get("productName") ?? "";
        }

        [res] = await showProductUseCase.execute(filters);
      } else {
        res = await showProductUseCase.execute();
      }

      setProducts(res);
      setLoading(false);
    }

    productRepository.setToken(token);
    fetchProduct();
  }, []);

  return { products, loading, setProducts };
};

export const useProductSlugHook = (
  id: string
): {
  product: ProductEntity | null;
  loading: boolean;
  setProduct: Dispatch<SetStateAction<ProductEntity | null>>;
} => {
  const { token } = useAuth();

  const [product, setProduct] = useState<ProductEntity | null>(null);
  const [loading, setLoading] = useState(false);
  const productRepository = new ProductRepository();

  useEffect(() => {
    productRepository.setToken(token);
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const getProductBySlugUseCase = new GetProductByCodeUseCase(
        productRepository
      );

      const res = await getProductBySlugUseCase.execute(id);

      setProduct(res);
      setLoading(false);
    }

    if (!product) {
      fetchProduct();
    }
  }, [product]);

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
  products: ProductItemEntity[];
  total: number;
  loading: boolean;
  paginateParameterKey: (params: ProductPaginationParameters) => void;
} => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuth();

  const [products, setProducts] = useState<ProductItemEntity[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const productRepository = new ProductRepository();

  async function paginateParameterKey(params: ProductPaginationParameters) {
    const showProductUseCase = new ShowProductsUseCase(productRepository);

    showProductUseCase.execute(params).then(([resProducts, resTotal]) => {
      setProducts(resProducts);
      setTotal(resTotal);
    });

    setSearchParams(qs.stringify(params));
  }

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);

      const showProductUseCase = new ShowProductsUseCase(productRepository);

      const [resProducts, resTotal] = await showProductUseCase.execute(
        qs.parse(searchParams.toString())
      );

      setProducts(resProducts);
      setTotal(resTotal);

      setLoading(false);
    }

    productRepository.setToken(token);
    fetchProduct();
  }, []);

  return { products, total, loading, paginateParameterKey };
};
