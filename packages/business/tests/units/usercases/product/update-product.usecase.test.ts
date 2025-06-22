import { UpdateProductDTO } from "$domain/dtos";
import { UpdateProductUseCase } from "$domain/usecases/product/update-product.usecase";
import { IdObject } from "$domain/value-objects";
import { InMemoryProductRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let productRepository: InMemoryProductRepository;

beforeEach(() => {
  productRepository = new InMemoryProductRepository();
});

describe('UpdateProductUseCase', () => {
  it('it should throw an error if product is not found', () => {
    const notExistingProductId = new IdObject(productRepository.products.length + 999)
    const notExistingProduct = {
        id: notExistingProductId,
        name: "Not existing product",
    }

    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    expect(updateProductUseCase.execute(notExistingProductId, notExistingProduct)).rejects.toThrow(
      new Error("Product not found")
    );
  });
  
  it("should set quantity to 0 if quantity is negative", async () => {
    const existingProductId = new IdObject(1);
    const existingProductDTO: UpdateProductDTO = {
      quantity: -23,
    };

    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const updatedProduct = await updateProductUseCase.execute(
      existingProductId,
      existingProductDTO
    );

    expect(updatedProduct.quantity).toEqual(0);
  });

  it("should set inventoryStatus to OUTOFSTOCK if quantity is zero", async () => {
    const existingProductId = new IdObject(1);
    const existingProductDTO: UpdateProductDTO = {
      quantity: 0,
    };

    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const updatedProduct = await updateProductUseCase.execute(
      existingProductId,
      existingProductDTO
    );

    expect(updatedProduct.inventoryStatus).toEqual("OUTOFSTOCK");
  });

  it('should change updatedAt when product is updated', async () => {
    const existingProduct = productRepository.products[0];
    const existingProductDTO: UpdateProductDTO = {
      quantity: 0,
    };

    const updateProductUseCase = new UpdateProductUseCase(productRepository);

    const updatedProduct = await updateProductUseCase.execute(
      existingProduct.id,
      existingProductDTO
    );

    expect(updatedProduct.updatedAt).toBeGreaterThan(existingProduct.updatedAt);
  });
})
