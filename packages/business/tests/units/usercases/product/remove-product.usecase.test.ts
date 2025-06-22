import { GetProductByIdUseCase } from "$domain/usecases/product";
import { RemoveProductUseCase } from "$domain/usecases/product/remove-product.usecase";
import { IdObject } from "$domain/value-objects";
import { InMemoryProductRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let productRepository: InMemoryProductRepository;

beforeEach(() => {
  productRepository = new InMemoryProductRepository();
});

describe("RemoveProductUseCase", () => {
  it("should throw an error if product is not found", async () => {
    const nonExistedProductId = new IdObject(productRepository.products.length + 999);
    const removeProductUseCase = new RemoveProductUseCase(productRepository);

    expect(removeProductUseCase.execute(nonExistedProductId)).rejects.toThrow(
      new Error("Product not found")
    );
  });

  it("should remove a product", async () => {
    const existingProductId = new IdObject(1);
    const removeProductUseCase = new RemoveProductUseCase(productRepository);
    const deletedProduct =
      await removeProductUseCase.execute(existingProductId);

    expect(
      productRepository.products.find((product) =>
        product.id.equals(existingProductId)
      )
    ).toBeUndefined();

    const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
    const nonExistedProduct = await getProductByIdUseCase.execute(
      deletedProduct.id
    );

    expect(nonExistedProduct).toBeNull();
  });
});
