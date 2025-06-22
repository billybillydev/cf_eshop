
import { GetCategoryByIdUseCase } from "$domain/usecases/category/get-category-by-id.usecase";
import { IdObject } from "$domain/value-objects";
import { InMemoryCategoryRepository } from "$infrastructure/adapters/in-memory/in-memory-category.repository";
import { beforeEach, describe, expect, it } from "@jest/globals";

let categoryRepository: InMemoryCategoryRepository;

beforeEach(() => {
  categoryRepository = new InMemoryCategoryRepository();
});

describe("GetCategoryByIdUseCase", () => {
  it("should throw an error if category is not found", async () => {
    const nonExistedCategoryId = new IdObject(23);
    const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);

    const nonExistedCategory =
      await getCategoryByIdUseCase.execute(nonExistedCategoryId);

    expect(nonExistedCategory).toBeNull();
  });

  it("should return an existing category", async () => {
    const existingCategoryId = new IdObject(5);
    const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
    const existingCategory =
      await getCategoryByIdUseCase.execute(existingCategoryId);

    expect(existingCategory).not.toBeNull();
    if (existingCategory) {
      expect(existingCategory.id.equals(existingCategoryId)).toBeTruthy();
    }
  });
});
