import { GetProductByCodeUseCase } from "$domain/usecases/product/get-product-by-code.usecase";
import { InMemoryProductRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let productRepository: InMemoryProductRepository;

beforeEach(() => {
  productRepository = new InMemoryProductRepository();
});

describe("GetProductBySlugUseCase", () => {
  it("should throw an error if product is not found", async () => {
    const nonExistedProductCode = "non-existed-product";
    const getProductByCodeUseCase = new GetProductByCodeUseCase(productRepository);

    const nonExistedProduct =
      await getProductByCodeUseCase.execute(nonExistedProductCode);

    expect(nonExistedProduct).toBeNull();
  });

  it("should return an existing product", async () => {
    const existingProductCode = "elegant-metal-chips";
    const getProductByCodeUseCase = new GetProductByCodeUseCase(productRepository);
    const existingProduct =
      await getProductByCodeUseCase.execute(existingProductCode);

    expect(existingProduct).not.toBeNull();
    if (existingProduct) {
      expect(existingProduct.code === existingProductCode).toBeTruthy();
    }
  });
});
