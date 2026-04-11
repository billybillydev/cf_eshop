import { CustomerEntity } from "$domain/entities";
import {
  AddProductToCustomerFavoriteUseCase,
  CreateCustomerUseCase,
  DeleteFavoriteUseCase,
} from "$domain/usecases/customer";
import { InMemoryFavoriteRepository, InMemoryProductRepository } from "$infrastructure/adapters/in-memory";
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

describe("DeleteFavoriteUseCase", () => {
  it("should delete an existing favorite", async () => {
    const addUseCase = new AddProductToCustomerFavoriteUseCase(
      customerRepository,
      productRepository,
      favoriteRepository
    );
    const deleteUseCase = new DeleteFavoriteUseCase(
      customerRepository,
      productRepository,
      favoriteRepository
    );
    const dto = {
      customerId: customer!.id.value(),
      productId: 10,
    };
    await addUseCase.execute(dto);

    const result = await deleteUseCase.execute(dto);

    expect(result.success).toBe(true);
  });

  it("should throw an error when deleting a favorite that does not exist", async () => {
    const deleteUseCase = new DeleteFavoriteUseCase(
      customerRepository,
      productRepository,
      favoriteRepository
    );
    const dto = {
      customerId: customer!.id.value(),
      productId: 10,
    };

    await expect(deleteUseCase.execute(dto)).rejects.toThrow(
      "Product is not in favorites"
    );
  });
});
