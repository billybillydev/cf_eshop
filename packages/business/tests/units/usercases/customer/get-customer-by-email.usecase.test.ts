import { GetCustomerByEmailUseCase } from "$domain/usecases/customer/get-customer-by-email.usecase";
import { InMemoryCustomerRepository } from "$infrastructure/adapters/in-memory/in-memory-customer.repository";
import { beforeEach, describe, expect, it } from "@jest/globals";

let customerRepository: InMemoryCustomerRepository;

beforeEach(() => {
  customerRepository = new InMemoryCustomerRepository();
});

describe("GetCustomerByEmailUseCase", () => {
  it("should throw an error if email is invalid", async () => {
    const getCustomerByEmailUseCase = new GetCustomerByEmailUseCase(
      customerRepository
    );

    expect(
      getCustomerByEmailUseCase.execute("john@doe", "toto")
    ).rejects.toThrow(new Error("Invalid email"));
  });

  it("should return null if customer is not found", async () => {
    const getCustomerByEmailUseCase = new GetCustomerByEmailUseCase(
      customerRepository
    );
    const nonExistingCustomer = await getCustomerByEmailUseCase.execute(
      "john@doe.fr",
      "toto"
    );

    expect(nonExistingCustomer).toBeNull();
  });

  it("should return null if password is wrong", async () => {
    const customerToCreate = {
      username: "john",
      firstname: "John",
      email: "john@doe.com",
      password: "password",
    };
    await customerRepository.create(customerToCreate);

    const getCustomerByEmailUseCase = new GetCustomerByEmailUseCase(
      customerRepository
    );
    const wrongPasswordCustomer = await getCustomerByEmailUseCase.execute(
      customerToCreate.email,
      "wrongPassword"
    );

    expect(wrongPasswordCustomer).toBeNull();
  });

  it("should return the customer", async () => {
    const customerToCreate = {
      username: "john",
      firstname: "John",
      email: "john@doe.com",
      password: "1234password",
    };
    await customerRepository.create(customerToCreate);

    const getCustomerByEmailUseCase = new GetCustomerByEmailUseCase(
      customerRepository
    );
    const existingCustomer = await getCustomerByEmailUseCase.execute(
      customerToCreate.email,
      customerToCreate.password
    );

    expect(existingCustomer).not.toBeNull();
    expect(existingCustomer?.username).toEqual(customerToCreate.username);
    expect(existingCustomer?.firstname).toEqual(customerToCreate.firstname);
    expect(existingCustomer?.email.toString()).toEqual(customerToCreate.email);
  });
});
