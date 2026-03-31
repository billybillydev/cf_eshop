import { IsUserAdminUseCase } from "$domain/usecases/customer";
import { InMemoryCustomerRepository } from "$infrastructure/adapters/in-memory/in-memory-customer.repository";
import { beforeEach, describe, expect, it } from "@jest/globals";

let customerRepository: InMemoryCustomerRepository;

beforeEach(() => {
  customerRepository = new InMemoryCustomerRepository();
});

describe("IsUserAdminUseCase", () => {
  it("should return false if customer is not found", async () => {
    const isUserAdminUseCase = new IsUserAdminUseCase(customerRepository);

    const result = await isUserAdminUseCase.execute("random@email.com");

    expect(result).toBeFalsy();
  });
  
  it("should return false if customer is not admin", async () => {
    const isUserAdminUseCase = new IsUserAdminUseCase(customerRepository);

    const result = await isUserAdminUseCase.execute("john@doe.com");

    expect(result).toBeFalsy();
  });

  it("should return true if user is admin", async () => {
    const adminUser = {
      username: "admin",
      firstname: "Admin",
      email: "admin@eshop.com",
      password: "password",
    };
    await customerRepository.create(adminUser);
    
    const isUserAdminUseCase = new IsUserAdminUseCase(customerRepository);

    const result = await isUserAdminUseCase.execute("admin@eshop.com");

    expect(result).toBeTruthy();
  });
});
