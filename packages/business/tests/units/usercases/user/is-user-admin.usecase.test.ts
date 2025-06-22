import { IsUserAdminUseCase } from "$domain/usecases/user";
import { InMemoryUserRepository } from "$infrastructure/adapters/in-memory/in-memory-user.repository";
import { beforeEach, describe, expect, it } from "@jest/globals";

let userRepository: InMemoryUserRepository;

beforeEach(() => {
  userRepository = new InMemoryUserRepository();
});

describe("IsUserAdlinUseCase", () => {
  it("should return false if user is not found", async () => {
    const isUserAdminUseCase = new IsUserAdminUseCase(userRepository);

    const result = await isUserAdminUseCase.execute("random@email.com");

    expect(result).toBeFalsy();
  });
  
  it("should return false if user is not admin", async () => {
    const isUserAdminUseCase = new IsUserAdminUseCase(userRepository);

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
    await userRepository.create(adminUser);
    
    const isUserAdminUseCase = new IsUserAdminUseCase(userRepository);

    const result = await isUserAdminUseCase.execute("admin@eshop.com");

    expect(result).toBeTruthy();
  });
});
