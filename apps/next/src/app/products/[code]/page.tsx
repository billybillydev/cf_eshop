import { TOKEN_COOKIE_NAME } from "$config/auth";
import { ProductRepository } from "$infrastructure/repositories/product.repository";
import { ProductCodePage } from "$pages/products/code.page";
import { GetProductByCodeUseCase } from "@eshop/business/domain/usecases/product";
import { cookies } from "next/headers";

export default async function Page({ params }: { params: { code: string } }) {
  const code = params.code;
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("Missing API_URL");
  }

  const token = cookies().get(TOKEN_COOKIE_NAME)?.value;
  const productRepository = new ProductRepository(apiUrl);
  if (token) {
    productRepository.setToken(token);
  }

  const getProductByCodeUseCase = new GetProductByCodeUseCase(
    productRepository
  );
  const product = await getProductByCodeUseCase.execute(code);

  return <ProductCodePage product={product?.transformToDTO() ?? null} />;
}
