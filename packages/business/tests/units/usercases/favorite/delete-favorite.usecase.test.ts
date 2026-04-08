import { AddFavoriteDTO } from "$domain/dtos/favorite";
import { IdObject } from "$domain/value-objects";
import {
  AddFavoriteUseCase,
  DeleteFavoriteUseCase,
} from "$domain/usecases/favorite";
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

describe("DeleteFavoriteUseCase", () => {
  it("should delete an existing favorite and return the removed entity", async () => {
    const addUseCase = new AddFavoriteUseCase(repository);
    const dto = makeAddFavoriteDTO();
    await addUseCase.execute(dto);

    const deleteUseCase = new DeleteFavoriteUseCase(repository);
    const removed = await deleteUseCase.execute(
      new IdObject(dto.customerId),
      new IdObject(dto.productId)
    );

    expect(removed.productId.value()).toBe(dto.productId);

    const remaining = await repository.getAll(new IdObject(dto.customerId));
    expect(remaining.length).toBe(0);
  });

  it("should throw an error when deleting a favorite that does not exist", async () => {
    const deleteUseCase = new DeleteFavoriteUseCase(repository);

    await expect(
      deleteUseCase.execute(new IdObject(999), new IdObject(999))
    ).rejects.toThrow("Favorite not found");
  });
});
