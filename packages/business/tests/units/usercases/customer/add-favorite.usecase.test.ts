import { CustomerEntity } from "$domain/entities";
import { CreateCustomerUseCase, GetCustomerFavoritesUseCase } from "$domain/usecases/customer";
import { AddProductToCustomerFavoriteUseCase } from "$domain/usecases/customer/add-favorite-to-customer.usecase";
import { InMemoryFavoriteRepository } from "$infrastructure/adapters/in-memory";
import { InMemoryCustomerRepository } from "$infrastructure/adapters/in-memory/in-memory-customer.repository";
import { InMemoryProductRepository } from "$infrastructure/adapters/in-memory/in-memory-product.repository";
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

describe("AddFavoriteToCustomerUseCase", () => {
  it("should add a favorite for a customer", async () => {
    const useCase = new AddProductToCustomerFavoriteUseCase(
      customerRepository,
      productRepository,
      favoriteRepository
    );

    const result = await useCase.execute({
      customerId: customer!.id.value(),
      productId: 10,
    });
    expect(result.success).toBe(true);
  });

  it("should throw an error when adding a favorite that already exists", async () => {
    const useCase = new AddProductToCustomerFavoriteUseCase(
      customerRepository,
      productRepository,
      favoriteRepository
    );

    const dto = {
      customerId: customer!.id.value(),
      productId: 10,
    };
    await useCase.execute(dto);

    expect(useCase.execute(dto)).rejects.toThrow(
      "Product is already in favorites"
    );
  });

  it("should persist the favorites for customer", async () => {
    const addProductToCustomerFavoriteUseCase = new AddProductToCustomerFavoriteUseCase(
      customerRepository,
      productRepository,
      favoriteRepository
    );

    await addProductToCustomerFavoriteUseCase.execute({
      customerId: customer!.id.value(),
      productId: 10,
    });
    await addProductToCustomerFavoriteUseCase.execute({
      customerId: customer!.id.value(),
      productId: 11,
    });

    const getAllFavoritesByCustomerId = new GetCustomerFavoritesUseCase(favoriteRepository);
    const result = await getAllFavoritesByCustomerId.execute({
      customerId: customer!.id.value(),
    });
    
    expect(result?.length).toBe(2);
  });
});
