import { GetProductByIdUseCase } from "$domain/usecases/product";
import { IdObject } from "$domain/value-objects";
import { InMemoryProductRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let productRepository: InMemoryProductRepository;

beforeEach(() => {
  productRepository = new InMemoryProductRepository();
});

describe("GetProductByIdUseCase", () => {
  it("should throw an error if product is not found", async () => {
    const nonExistedProductId = new IdObject(23);
    const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);

    const nonExistedProduct =
      await getProductByIdUseCase.execute(nonExistedProductId);

    expect(nonExistedProduct).toBeNull();
  });

  it("should return an existing product", async () => {
    const existingProductId = new IdObject(15);
    const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
    const existingProduct =
      await getProductByIdUseCase.execute(existingProductId);

    expect(existingProduct).not.toBeNull();
    if (existingProduct) {
      expect(existingProduct.id.equals(existingProductId)).toBeTruthy();
    }
  });
});
