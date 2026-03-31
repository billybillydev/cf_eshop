import { TOKEN_COOKIE_NAME } from "$config/auth";
import { ProductRepository } from "$infrastructure/repositories/product.repository";
import { GetProductByCodeUseCase } from "@eshop/business/domain/usecases/product";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  const code = params.code;
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json(
      { success: false, error: "Missing API_URL" },
      { status: 500 }
    );
  }
  
  const token = cookies().get(TOKEN_COOKIE_NAME)?.value;
  console.log("in GET /api/products/code/[code] : ", { code, token });
  const productRepository = new ProductRepository(apiUrl);
  if (token) {
    productRepository.setToken(token);
  }

  const getProductByCodeUseCase = new GetProductByCodeUseCase(
    productRepository
  );
  const product = await getProductByCodeUseCase.execute(code);

  console.log("in GET /api/products/code/[code] : ", { product });

  if (!product) {
    return NextResponse.json(
      { success: false, error: "Product not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      product: product.transformToDTO(),
    },
    { status: 200 }
  );
}
