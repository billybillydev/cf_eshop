import { CartEntity, CartItemProductEntity } from "$domain/entities";
import { AddToCartUseCase, GetCartUseCase } from "$domain/usecases/cart";
import { InMemoryCartRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let cartRepository: InMemoryCartRepository;
const product = new CartItemProductEntity({
  id: 8,
  name: "Elegant Metal Chips",
  code: "elegant-metal-chips",
  price: 1424.00,
  image:
    "https://loremflickr.com/640/480/computers?lock=5251611119058944/thumbnail",
  category: {
    id: 1,
    name: "Electronics",
  },
  inventoryStatus: "INSTOCK",
});

beforeEach(() => {
  cartRepository = new InMemoryCartRepository();
});

describe("AddToCartUseCase", () => {
  it("should return a cart where current items length and quantity are greater than previous items length and quantity", async () => {
    const getCartUseCase = new GetCartUseCase(cartRepository);
    const previousCart = await getCartUseCase.execute();
    const previousCartItemsLength = previousCart.items.length;
    const previousCartTotalQuantity = previousCart.totalQuantity;

    // When product is added to cart
    const addToCartUseCase = new AddToCartUseCase(cartRepository);
    const currentCart: CartEntity = await addToCartUseCase.execute(product);
    const currentCartItemsLength = currentCart.items.length;
    const currentCartTotalQuantity = currentCart.totalQuantity;

    // Then we check that new items length and total quantity are greater than previous values
    expect(currentCartItemsLength).toBeGreaterThan(previousCartItemsLength);
    expect(currentCartTotalQuantity).toBeGreaterThan(previousCartTotalQuantity);
  });

  it("should return a cart where specific cart item quantity and totalQuantity updated if added a product already in cart", async () => {
    const addToCartUseCase = new AddToCartUseCase(cartRepository);
    const currentCart: CartEntity = await addToCartUseCase.execute(product);
    const currentCartItemsLength = currentCart.items.length;
    const currentCartTotalQuantity = currentCart.totalQuantity;

    const matchedCartItemIndex = currentCart.items.findIndex((item) =>
      item.product.id.equals(product.id)
    );
    if (matchedCartItemIndex > -1) {
      const matchedCurrentCartItemQuantity =
        currentCart.items[matchedCartItemIndex].quantity;

      // Then we add again the same product in cart
      const updatedCart: CartEntity = await addToCartUseCase.execute(product);
      const updatedCartItemsLength = updatedCart.items.length;
      const updatedCartTotalQuantity = updatedCart.totalQuantity;

      const matchedUpdatedCartItemQuantity =
        updatedCart.items[matchedCartItemIndex].quantity;

      // Then we check that corresponding product quantity in cart is greater, items length does not change and totalQuantity is greater.
      expect(updatedCartItemsLength).toEqual(currentCartItemsLength);
      expect(updatedCartTotalQuantity).toBeGreaterThan(
        currentCartTotalQuantity
      );
      expect(matchedUpdatedCartItemQuantity).toBeGreaterThan(
        matchedCurrentCartItemQuantity
      );
    }
  });
});
