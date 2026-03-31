import { TOKEN_COOKIE_NAME } from "$config/auth";
import { CategoryRepository } from "$infrastructure/repositories/category.repository";
import { GetAllCategoriesUseCase } from "@eshop/business/domain/usecases/category";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      return NextResponse.json(
        { success: false, error: "Missing API_URL" },
        { status: 500 }
      );
    }
  
    const token = cookies().get(TOKEN_COOKIE_NAME)?.value;
  
    const categoryRepository = new CategoryRepository(apiUrl);
    if (token) {
      categoryRepository.setToken(token);
    }
    const getAllCategoriesUseCase = new GetAllCategoriesUseCase(
      categoryRepository
    );
    const categories = await getAllCategoriesUseCase.execute();
    
    return NextResponse.json(categories.map(category => category.transformToDTO()), { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
