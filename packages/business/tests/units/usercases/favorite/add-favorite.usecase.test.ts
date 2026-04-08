import { AddFavoriteDTO } from "$domain/dtos/favorite";
import { AddFavoriteUseCase } from "$domain/usecases/favorite";
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

describe("AddFavoriteUseCase", () => {
  it("should add a favorite and return the created favorite entity", async () => {
    const useCase = new AddFavoriteUseCase(repository);
    const dto = makeAddFavoriteDTO();

    const result = await useCase.execute(dto);

    expect(result.id.value()).toBeDefined();
    expect(result.productId.value()).toBe(dto.productId);
    expect(result.customerId.value()).toBe(dto.customerId);
    expect(result.productImage).toBe(dto.productImage);
    expect(result.inventoryStatus).toBe(dto.inventoryStatus);
  });

  it("should throw an error when adding a favorite that already exists", async () => {
    const useCase = new AddFavoriteUseCase(repository);
    const dto = makeAddFavoriteDTO();

    await useCase.execute(dto);

    await expect(useCase.execute(dto)).rejects.toThrow("Favorite already exists");
  });

  it("should persist the favorite so it appears in getAll", async () => {
    const addUseCase = new AddFavoriteUseCase(repository);
    const dto = makeAddFavoriteDTO();

    await addUseCase.execute(dto);

    const all = await repository.getAll(
      (await addUseCase.execute(makeAddFavoriteDTO({ productId: 20 }))).customerId
    );
    expect(all.length).toBe(2);
  });
});
