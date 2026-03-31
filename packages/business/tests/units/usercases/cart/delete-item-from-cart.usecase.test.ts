import { CartEntity, CartItemProductEntity } from "$domain/entities";
import {
  AddToCartUseCase,
  DeleteItemFormCartUseCase,
} from "$domain/usecases/cart";
import { InMemoryCartRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let cartRepository: InMemoryCartRepository;

beforeEach(() => {
  cartRepository = new InMemoryCartRepository();
});

describe("DeleteItemFromCartUseCase", () => {
  it("should remove corresponding item from cart and decrease totalQuantity", async () => {
    const product = new CartItemProductEntity({
      id: 8,
      name: "Elegant Metal Chips",
      code: "elegant-metal-chips",
      price: 1424.0,
      image:
        "https://loremflickr.com/640/480/computers?lock=5251611119058944/thumbnail",
      category: {
        id: 1,
        name: "Electronics",
      },
      inventoryStatus: "INSTOCK",
    });

    const addToCartUseCase = new AddToCartUseCase(cartRepository);
    const currentCart: CartEntity = await addToCartUseCase.execute(product);
    const currentCartItemsLength = currentCart.items.length;
    const currentCartTotalQuantity = currentCart.totalQuantity;

    const deleteItemFromCartUseCase = new DeleteItemFormCartUseCase(
      cartRepository
    );
    const updatedCart: CartEntity = await deleteItemFromCartUseCase.execute(
      product.id
    );
    const updatedCartItemsLength = updatedCart.items.length;
    const updatedCartTotalQuantity = updatedCart.totalQuantity;

    expect(updatedCartItemsLength).toBeLessThan(currentCartItemsLength);
    expect(updatedCartTotalQuantity).toBeLessThan(currentCartTotalQuantity);
  });
});
