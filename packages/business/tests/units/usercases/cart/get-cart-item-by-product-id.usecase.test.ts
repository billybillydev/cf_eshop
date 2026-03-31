import { CartItemProductEntity } from "$domain/entities";
import { AddToCartUseCase } from "$domain/usecases/cart";
import { GetCartItemByProductIdUseCase } from "$domain/usecases/cart/get-cart-item-by-product-id.usecase";
import { InMemoryCartRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let cartRepository: InMemoryCartRepository;

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

beforeEach(() => {
  cartRepository = new InMemoryCartRepository();
});

describe("GetCartItemByProductIdUseCase", () => {
  it("should return true if product in cart", async () => {
    const addToCart = new AddToCartUseCase(cartRepository);
    await addToCart.execute(product);

    const isProductInCartUseCase = new GetCartItemByProductIdUseCase(
      cartRepository
    );
    const isInCart = await isProductInCartUseCase.execute(product.id);

    expect(isInCart).toBeTruthy();
  });

  it("should return false if product is not in cart", async () => {
    const isProductInCartUseCase = new GetCartItemByProductIdUseCase(
      cartRepository
    );
    const isInCart = await isProductInCartUseCase.execute(product.id);
    expect(isInCart).toBeFalsy();
  });
});
