import { CustomerEntity } from "$domain/entities";
import {
  AddProductToCustomerFavoriteUseCase,
  CreateCustomerUseCase,
} from "$domain/usecases/customer";
import { GetCustomerFavoritesUseCase } from "$domain/usecases/customer/get-customer-favorites.usecase";
import {
  InMemoryFavoriteRepository,
  InMemoryProductRepository,
} from "$infrastructure/adapters/in-memory";
import { InMemoryCustomerRepository } from "$infrastructure/adapters/in-memory/in-memory-customer.repository";
import { beforeEach, describe, expect, it } from "@jest/globals";

let customerRepository: InMemoryCustomerRepository;
let productRepository: InMemoryProductRepository;
let favoriteRepository: InMemoryFavoriteRepository;
let customer: CustomerEntity | null;

beforeEach(async () => {
  customerRepository = new InMemoryCustomerRepository();
  productRepository = new InMemoryProductRepository();
  favoriteRepository = new InMemoryFavoriteRepository();

  const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);
  customer = await createCustomerUseCase.execute({
    username: "test",
    firstname: "test",
    email: "test@test.com",
    password: "test",
  });

  if (!customer) {
    throw new Error("Customer not created");
  }
});

describe("GetCustomerFavoritesUseCase", () => {
  it("should return an empty array when the customer has no favorites", async () => {
    const getCustomerFavoritesUseCase = new GetCustomerFavoritesUseCase(
      favoriteRepository
    );
    const favorites = await getCustomerFavoritesUseCase.execute({
      customerId: customer!.id.value(),
    });
    expect(favorites).toEqual([]);
  });

  it("should return the customer's favorites", async () => {
    const addProductToCustomerFavoriteUseCase =
      new AddProductToCustomerFavoriteUseCase(
        customerRepository,
        productRepository,
        favoriteRepository
      );
    const product = productRepository.products[0];
    await addProductToCustomerFavoriteUseCase.execute({
      customerId: customer!.id.value(),
      productId: product.id.value(),
    });
    const getCustomerFavoritesUseCase = new GetCustomerFavoritesUseCase(
      favoriteRepository
    );
    const favorites = await getCustomerFavoritesUseCase.execute({
      customerId: customer!.id.value(),
    });
    expect(favorites.some((f) => f.productId.equals(product.id))).toBe(true);
  });
});
