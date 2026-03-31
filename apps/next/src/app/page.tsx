import { TOKEN_COOKIE_NAME } from "$config/auth";
import { ProductRepository } from "$infrastructure/repositories/product.repository";
import { ProductsPage } from "$pages/products/index.page";
import { ShowProductsUseCase } from "@eshop/business/domain/usecases/product";
import { cookies } from "next/headers";

type SearchParams = {
  search?: string;
  page?: string;
  limit?: string;
  category?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("Missing API_URL");
  }

  const token = cookies().get(TOKEN_COOKIE_NAME)?.value;
  const paramsObject: Record<string, number | string> = {};
  for (const param in searchParams) {
    if (!Object.hasOwn(searchParams, param)) continue;

    paramsObject[param] = Number.isInteger(
      Number(searchParams[param as keyof SearchParams])
    )
      ? Number(searchParams[param as keyof SearchParams])
      : searchParams[param as keyof SearchParams];
  }
  const productRepository = new ProductRepository(apiUrl);
  if (token) {
    productRepository.setToken(token);
  }
  const showProductsUseCase = new ShowProductsUseCase(productRepository);
  const [products, total] = await showProductsUseCase.execute(
    paramsObject ?? null
  );

  return (
    <ProductsPage
      products={products.map((product) => product.transformToDTO())}
      total={total}
    />
  );
}
