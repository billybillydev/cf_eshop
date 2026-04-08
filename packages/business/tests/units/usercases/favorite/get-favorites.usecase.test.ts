import { AddFavoriteDTO } from "$domain/dtos/favorite";
import { IdObject } from "$domain/value-objects";
import { AddFavoriteUseCase, GetFavoritesUseCase } from "$domain/usecases/favorite";
import { InMemoryFavoriteRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let repository: InMemoryFavoriteRepository;

function makeAddFavoriteDTO(overrides?: Partial<AddFavoriteDTO>): AddFavoriteDTO {
  return {
    productId: 10,
    customerId: 100,
    productImage: "https://example.com/image.png",
    inventoryStatus: "INSTOCK",
    ...overrides,
  };
}

beforeEach(() => {
  repository = new InMemoryFavoriteRepository();
});

describe("GetFavoritesUseCase", () => {
  it("should return an empty array when no favorites exist for the customer", async () => {
    const useCase = new GetFavoritesUseCase(repository);
    const result = await useCase.execute(new IdObject(100));

    expect(Array.isArray(result)).toBeTruthy();
    expect(result.length).toBe(0);
  });

  it("should return all favorites for a given customerId", async () => {
    const addUseCase = new AddFavoriteUseCase(repository);
    await addUseCase.execute(makeAddFavoriteDTO({ productId: 10 }));
    await addUseCase.execute(makeAddFavoriteDTO({ productId: 20 }));

    const useCase = new GetFavoritesUseCase(repository);
    const result = await useCase.execute(new IdObject(100));

    expect(result.length).toBe(2);
  });

  it("should not return favorites belonging to a different customer", async () => {
    const addUseCase = new AddFavoriteUseCase(repository);
    await addUseCase.execute(makeAddFavoriteDTO({ customerId: 100 }));
    await addUseCase.execute(makeAddFavoriteDTO({ customerId: 200 }));

    const useCase = new GetFavoritesUseCase(repository);
    const result = await useCase.execute(new IdObject(100));

    expect(result.length).toBe(1);
    expect(result[0].customerId.value()).toBe(100);
  });
});
