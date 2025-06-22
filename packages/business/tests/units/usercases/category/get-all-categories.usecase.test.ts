
import { GetAllCategoriesUseCase } from "$domain/usecases/category/get-all-categories.usecase";
import { InMemoryCategoryRepository } from "$infrastructure/adapters/in-memory/in-memory-category.repository";
import { beforeEach, describe, expect, it } from "@jest/globals";

let categoryRepository: InMemoryCategoryRepository;

beforeEach(() => {
  categoryRepository = new InMemoryCategoryRepository();
});

describe("GetAllCategories", () => {
  it("should return all categories", async () => {
    const getAllCategoriesUseCase = new GetAllCategoriesUseCase(categoryRepository);
    const categories = await getAllCategoriesUseCase.execute();

    expect(Array.isArray(categories)).toBeTruthy();
  });
});
