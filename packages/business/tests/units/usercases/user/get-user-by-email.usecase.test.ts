import { GetUserByEmailUseCase } from "$domain/usecases/user";
import { InMemoryUserRepository } from "$infrastructure/adapters/in-memory/in-memory-user.repository";
import { beforeEach, describe, expect, it } from "@jest/globals";

let userRepository: InMemoryUserRepository;

beforeEach(() => {
  userRepository = new InMemoryUserRepository();
});

describe("GetUserByEmailUseCase", () => {
  it("should throw an error if email is invalid", async () => {
    const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);

    expect(getUserByEmailUseCase.execute("john@doe", "toto")).rejects.toThrow(
      new Error("Invalid email")
    );
  });

  it("should return null if user is not found", async () => {
    const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
    const nonExistingUser = await getUserByEmailUseCase.execute("john@doe.fr", "toto");

    expect(nonExistingUser).toBeNull();
  });

  it("should return null if password is wrong", async () => {
    const userToCreate = {
      username: "john",
      firstname: "John",
      email: "john@doe.com",
      password: "password",
    };
    await userRepository.create(userToCreate);

    const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
    const wrongPasswordUser = await getUserByEmailUseCase.execute(userToCreate.email, "wrongPassword");

    expect(wrongPasswordUser).toBeNull();
  });
  
  it("should return the user", async () => {
    const userToCreate = {
      username: "john",
      firstname: "John",
      email: "john@doe.com",
      password: "1234password",
    };
    await userRepository.create(userToCreate);

    const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
    const existingUser = await getUserByEmailUseCase.execute(userToCreate.email, userToCreate.password);

    expect(existingUser).not.toBeNull();
    expect(existingUser?.username).toEqual(userToCreate.username);
    expect(existingUser?.firstname).toEqual(userToCreate.firstname);
    expect(existingUser?.email.toString()).toEqual(userToCreate.email);
  });
});
