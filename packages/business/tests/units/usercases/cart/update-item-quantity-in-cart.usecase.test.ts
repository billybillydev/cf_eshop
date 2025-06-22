import { CartItemProductEntity } from "$domain/entities";
import { UpdateItemQuantityInCartUseCase } from "$domain/usecases/cart/update-item-quantity-in-cart.usecase";
import { IdObject, PriceObject } from "$domain/value-objects";
import { InMemoryCartRepository } from "$infrastructure/adapters/in-memory/in-memory-cart.repository";
import { beforeEach, describe, expect, it } from "@jest/globals";

let cartRepository: InMemoryCartRepository;
const existingProduct = new CartItemProductEntity({
  id: new IdObject(8),
  name: "Elegant Metal Chips",
  code: "elegant-metal-chips",
  price: new PriceObject(1424.0),
  image:
    "https://loremflickr.com/640/480/computers?lock=5251611119058944/thumbnail",
});

beforeEach(() => {
  cartRepository = new InMemoryCartRepository();
});

describe("UpdateItemQuantityInCartUseCase", () => {
  it("should throw error when product is not found in cart", async () => {
    const nonExistingProductId = new IdObject(68);

    cartRepository.addToCart(existingProduct);

    const updateItemQuantityInCartUseCase = new UpdateItemQuantityInCartUseCase(
      cartRepository
    );

    expect(
      updateItemQuantityInCartUseCase.execute(nonExistingProductId, 2)
    ).rejects.toThrow(
      `Product in cart with id ${nonExistingProductId} not found`
    );
  });

  it("should update item product quantity and totalQuantity in cart with greater values", async () => {
    const quantity = 2;

    cartRepository.addToCart(existingProduct);

    const cart = await cartRepository.getCart();

    const previousTotalQuantity = cart.totalQuantity;
    const itemProductInCart = cart.getItem(existingProduct.id);

    const updateItemQuantityInCartUseCase = new UpdateItemQuantityInCartUseCase(
      cartRepository
    );

    await updateItemQuantityInCartUseCase.execute(existingProduct.id, 3);

    expect(cart.totalQuantity).toBeGreaterThan(previousTotalQuantity);

    if (itemProductInCart) {
      expect(itemProductInCart.quantity).toBeGreaterThan(quantity);
    }
  });

  it("should update item product quantity and totalQuantity in cart with lesser values", async () => {
    const quantity = 2;

    cartRepository.addToCart(existingProduct, quantity);

    const cart = await cartRepository.getCart();
    const previousTotalQuantity = cart.totalQuantity;
    const itemProductInCart = cart.getItem(existingProduct.id);

    const updateItemQuantityInCartUseCase = new UpdateItemQuantityInCartUseCase(
      cartRepository
    );

    await updateItemQuantityInCartUseCase.execute(existingProduct.id, 1);

    expect(cart.totalQuantity).toBeLessThan(previousTotalQuantity);

    if (itemProductInCart) {
      expect(itemProductInCart.quantity).toBeLessThan(quantity);
    }
  });

  it("should delete item product and update totalQuantity with lesser value in cart if quantity = 0", async () => {
    const cart = await cartRepository.addToCart(existingProduct, 2);

    const previousTotalQuantity = cart.totalQuantity;

    const updateItemQuantityInCartUseCase = new UpdateItemQuantityInCartUseCase(
      cartRepository
    );

    await updateItemQuantityInCartUseCase.execute(existingProduct.id, 0);

    expect(cart.totalQuantity).toBeLessThan(previousTotalQuantity);
  });

  it("should delete item product and update totalQuantity with lesser value in cart if quantity < 0", async () => {
    const cart = await cartRepository.addToCart(existingProduct, 2);

    const previousTotalQuantity = cart.totalQuantity;

    const updateItemQuantityInCartUseCase = new UpdateItemQuantityInCartUseCase(
      cartRepository
    );

    await updateItemQuantityInCartUseCase.execute(existingProduct.id, -1);

    expect(cart.totalQuantity).toBeLessThan(previousTotalQuantity);
  });
});
