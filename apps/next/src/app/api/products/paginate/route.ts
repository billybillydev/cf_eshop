import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "$config/auth";
import { ShowProductsUseCase } from "@eshop/business/domain/usecases/product";
import { ProductRepository } from "$infrastructure/repositories/product.repository";

export async function GET(request: Request) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { success: false, error: "Missing API_URL" },
      { status: 500 }
    );
  }

  const token = cookies().get(TOKEN_COOKIE_NAME)?.value;
  const params = new URL(request.url).searchParams;
  const paramsObject = Object.fromEntries(params);
  const productRepository = new ProductRepository(apiUrl);
  if (token) {
    productRepository.setToken(token);
  }
  const showProductsUseCase = new ShowProductsUseCase(productRepository);

  const [products, total] = await showProductsUseCase.execute(
    paramsObject ?? null
  );

  return NextResponse.json(
    [products.map((product) => product.transformToDTO()), total],
    { status: 200 }
  );
}
