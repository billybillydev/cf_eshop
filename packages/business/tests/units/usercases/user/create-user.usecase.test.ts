import { CreateUserUseCase } from "$domain/usecases/user";
import { PasswordObject } from "$domain/value-objects/password.value-object";
import { InMemoryUserRepository } from "$infrastructure/adapters/in-memory/in-memory-user.repository";
import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { createSandbox } from "sinon";

const sandbox = createSandbox();

let userRepository: InMemoryUserRepository;

beforeEach(() => {
  userRepository = new InMemoryUserRepository();
});

afterEach(() => {
  sandbox.restore();
});

describe("CreateUserUseCase", () => {
  it("should throw an error if username is missing", async () => {
    const createUserUseCase = new CreateUserUseCase(userRepository);

    expect(
      createUserUseCase.execute({
        username: "",
        firstname: "John",
        email: "john@doe.com",
        password: "password",
      })
    ).rejects.toThrow(new Error("Field username is required"));
  });

  it("should throw an error if firstname is missing", async () => {
    const createUserUseCase = new CreateUserUseCase(userRepository);

    expect(
      createUserUseCase.execute({
        username: "john",
        firstname: "",
        email: "john@doe.fr",
        password: "password",
      })
    ).rejects.toThrow(new Error("Field firstname is required"));
  });
  it("should throw an error if email is missing", async () => {
    const createUserUseCase = new CreateUserUseCase(userRepository);

    expect(
      createUserUseCase.execute({
        username: "john",
        firstname: "John",
        email: "",
        password: "password",
      })
    ).rejects.toThrow(new Error("Field email is required"));
  });

  it("should throw an error if username is missing", async () => {
    const createUserUseCase = new CreateUserUseCase(userRepository);

    expect(
      createUserUseCase.execute({
        username: "john",
        firstname: "John",
        email: "john@doe.org",
        password: "",
      })
    ).rejects.toThrow(new Error("Field password is required"));
  });

  it("should throw an error if email is invalid", async () => {
    const createUserUseCase = new CreateUserUseCase(userRepository);

    expect(
      createUserUseCase.execute({
        username: "john",
        firstname: "John",
        email: "john@doe",
        password: "toto",
      })
    ).rejects.toThrow(new Error("Email is invalid"));
  });

  it("should return null if user already exists", async () => {
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const userToCreate = {
      username: "john",
      firstname: "John",
      email: "john@doe.com",
      password: "toto",
    };
    await createUserUseCase.execute(userToCreate);

    const createdUser = await createUserUseCase.execute(userToCreate);

    const consoleErrorStub = sandbox.stub(console, "error");

    expect(consoleErrorStub.alwaysCalledWithExactly("User already exists"))
      .toBeTruthy;
    expect(createdUser).toBeNull();
  });

  it("should create a user and return the created user", async () => {
    const createUserUseCase = new CreateUserUseCase(userRepository);

    const newUser = {
      username: "john",
      firstname: "John",
      email: "john@doe.com",
      password: "toto",
    };
    const createdUser = await createUserUseCase.execute(newUser);

    expect(createdUser).not.toBeNull();
    for (const key in newUser) {
      expect(Reflect.has(createdUser!.transformToDTO(), key)).toEqual(
        Reflect.has(newUser, key)
      );

      if (key === "password") {
        expect(
          await PasswordObject.match(newUser.password, createdUser!.password)
        ).toBeTruthy();
      } else {
        expect(Reflect.get(createdUser!.transformToDTO(), key)).toEqual(
          Reflect.get(newUser, key)
        );
      }
    }
  });
});
