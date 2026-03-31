import { CartEntity, OrderEntity } from "$domain/entities";
import { MakeOrderUseCase } from "$domain/usecases/order";
import {
  AddressValueObject,
  DeliveryMethodValueObject,
  PersonValueObject,
  PriceObject,
  RefundValueObject,
} from "$domain/value-objects";
import { InMemoryOrderRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let orderRepository: InMemoryOrderRepository;

const buyer = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
};

function makeCart(): CartEntity {
  return new CartEntity({
    items: [
      {
        product: {
          id: 1,
          name: "Test Product",
          code: "test-product",
          price: 29.99,
          image: "https://example.com/img.jpg",
          category: { id: 1, name: "General" },
          inventoryStatus: "INSTOCK",
        },
        quantity: 2,
      },
    ],
    totalQuantity: 2,
  });
}

function makeAddress(): AddressValueObject {
  return new AddressValueObject({
    line1: "123 Main St",
    city: "New York",
    zipCode: "10001",
    country: "USA",
  });
}

function makeDeliveryMethod(): DeliveryMethodValueObject {
  return new DeliveryMethodValueObject("express", "Express", 48, "hour");
}

beforeEach(() => {
  orderRepository = new InMemoryOrderRepository();
});

describe("CreateOrderUseCase", () => {
  it("should reject order creation when buyer is missing", async () => {
    const useCase = new MakeOrderUseCase(orderRepository);
    const cart = makeCart();
    const order = new OrderEntity(1, cart);

    expect(useCase.execute(order)).rejects.toThrow(
      "Buyer must be set before paying"
    );
  });

  it("should reject order creation when shipping address is missing", async () => {
    const useCase = new MakeOrderUseCase(orderRepository);
    const cart = makeCart();
    const order = new OrderEntity(1, cart);
    order.setBuyer({ type: "guest", data: new PersonValueObject(buyer) });

    expect(useCase.execute(order)).rejects.toThrow(
      "Shipping address must be set before paying"
    );
  });

  it("should reject order creation when billing address is missing", async () => {
    const useCase = new MakeOrderUseCase(orderRepository);
    const cart = makeCart();
    const order = new OrderEntity(1, cart);
    order.setBuyer({ type: "guest", data: new PersonValueObject(buyer) });
    order.setShippingAddress(makeAddress());

    expect(useCase.execute(order)).rejects.toThrow(
      "Billing address must be set before paying"
    );
  });

  it("should reject order creation when delivery method is missing", async () => {
    const useCase = new MakeOrderUseCase(orderRepository);
    const cart = makeCart();
    const order = new OrderEntity(1, cart);
    order.setBuyer({ type: "guest", data: new PersonValueObject(buyer) });
    order.setShippingAddress(makeAddress());
    order.setBillingAddress(makeAddress());

    expect(useCase.execute(order)).rejects.toThrow(
      "Delivery method must be set before paying"
    );
  });

  it("should allow paying the created order", async () => {
    const useCase = new MakeOrderUseCase(orderRepository);
    const cart = makeCart();
    const order = new OrderEntity(1, cart);
    order.setBuyer({ type: "guest", data: new PersonValueObject(buyer) });
    order.setShippingAddress(makeAddress());
    order.setBillingAddress(makeAddress());
    order.setDeliveryMethod(makeDeliveryMethod());

    expect(order.paid).toBe(false);

    await useCase.execute(order);

    expect(order.paid).toBe(true);
  });

  // it("should return delivery estimate from delivery method", async () => {
  //   const useCase = new MakeOrderUseCase(orderRepository);
  //   const order = new OrderEntity(makeCart());
  //   order.deliveryMethod = makeDeliveryMethod();

  //   expect(order.deliveryMethod.estimateDelivery()).toBe("48 hour");
  // });
});
