import { GetCustomerByIdUseCase } from "$domain/usecases/customer/get-customer-by-id.usecase";
import { InMemoryCustomerRepository } from "$infrastructure/adapters/in-memory/in-memory-customer.repository";
import { beforeEach, describe, expect, it } from "@jest/globals";

let customerRepository: InMemoryCustomerRepository;

beforeEach(() => {
  customerRepository = new InMemoryCustomerRepository();
});

describe("GetCustomerByIdUseCase", () => {
  it("should return null if customer is not found", async () => {
    const getCustomerByIdUseCase = new GetCustomerByIdUseCase(
      customerRepository
    );

    const nonExistingCustomer = await getCustomerByIdUseCase.execute(999);

    expect(nonExistingCustomer).toBeNull();
  });

  it("should return the customer if found", async () => {
    const customerToCreate = {
      username: "john",
      firstname: "John",
      email: "john@doe.com",
      password: "1234password",
    };
    const createdCustomer = await customerRepository.create(customerToCreate);

    const getCustomerByIdUseCase = new GetCustomerByIdUseCase(
      customerRepository
    );
    const existingCustomer = await getCustomerByIdUseCase.execute(
      createdCustomer!.id.value()
    );

    expect(existingCustomer).not.toBeNull();
    expect(existingCustomer?.username).toEqual(customerToCreate.username);
    expect(existingCustomer?.firstname).toEqual(customerToCreate.firstname);
    expect(existingCustomer?.email.toString()).toEqual(customerToCreate.email);
  });
});
