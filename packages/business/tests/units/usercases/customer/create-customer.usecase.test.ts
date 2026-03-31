import { CreateCustomerUseCase } from "$domain/usecases/customer/create-customer.usecase";
import { InMemoryCustomerRepository } from "$infrastructure/adapters/in-memory/in-memory-customer.repository";
import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { createSandbox } from "sinon";

const sandbox = createSandbox();

let customerRepository: InMemoryCustomerRepository;

beforeEach(() => {
  customerRepository = new InMemoryCustomerRepository();
});

afterEach(() => {
  sandbox.restore();
});

describe("CreateCustomerUseCase", () => {
  it("should throw an error if username is missing", async () => {
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    expect(
      createCustomerUseCase.execute({
        username: "",
        firstname: "John",
        email: "john@doe.com",
        password: "password",
      })
    ).rejects.toThrow(new Error("Field username is required"));
  });

  it("should throw an error if firstname is missing", async () => {
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    expect(
      createCustomerUseCase.execute({
        username: "john",
        firstname: "",
        email: "john@doe.fr",
        password: "password",
      })
    ).rejects.toThrow(new Error("Field firstname is required"));
  });
  it("should throw an error if email is missing", async () => {
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    expect(
      createCustomerUseCase.execute({
        username: "john",
        firstname: "John",
        email: "",
        password: "password",
      })
    ).rejects.toThrow(new Error("Field email is required"));
  });

  it("should throw an error if password is missing", async () => {
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    expect(
      createCustomerUseCase.execute({
        username: "john",
        firstname: "John",
        email: "john@doe.org",
        password: "",
      })
    ).rejects.toThrow(new Error("Field password is required"));
  });

  it("should throw an error if email is invalid", async () => {
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    expect(
      createCustomerUseCase.execute({
        username: "john",
        firstname: "John",
        email: "john@doe",
        password: "toto",
      })
    ).rejects.toThrow(new Error("Email is invalid"));
  });

  it("should return null if user already exists", async () => {
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    const userToCreate = {
      username: "john",
      firstname: "John",
      email: "john@doe.com",
      password: "toto",
    };
    await createCustomerUseCase.execute(userToCreate);

    const createdUser = await createCustomerUseCase.execute(userToCreate);

    const consoleLogStub = sandbox.stub(console, "log");

    expect(consoleLogStub.alwaysCalledWith("User already exists")).toBeTruthy;
    expect(createdUser).toBeNull();
  });

  it("should create a user and return the created user", async () => {
    const createCustomerUseCase = new CreateCustomerUseCase(customerRepository);

    const newUser = {
      username: "john",
      firstname: "John",
      email: "john@doe.com",
      password: "toto",
    };
    const createdUser = await createCustomerUseCase.execute(newUser);

    expect(createdUser).not.toBeNull();
    for (const key in newUser) {
      expect(Reflect.has(createdUser!.transformToDTO(), key)).toEqual(
        Reflect.has(newUser, key)
      );

      if (key === "password") {
        expect(await createdUser!.password.verify(newUser.password)).toBeTruthy();
      } else {
        expect(Reflect.get(createdUser!.transformToDTO(), key)).toEqual(
          Reflect.get(newUser, key)
        );
      }
    }
  });
});
