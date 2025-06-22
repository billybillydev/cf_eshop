import { GetCartUseCase } from "$domain/usecases/cart";
import { InMemoryCartRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let cartRepository: InMemoryCartRepository;

beforeEach(() => {
  cartRepository = new InMemoryCartRepository();
});

describe("GetCartUseCase", () => {
  it("should return a cart", async () => {
    const getCartUseCase = new GetCartUseCase(cartRepository);
    const cart = await getCartUseCase.execute();

    expect(Array.isArray(cart.items)).toBeTruthy();
    expect(cart.totalQuantity).not.toBeNull();
  });
});
