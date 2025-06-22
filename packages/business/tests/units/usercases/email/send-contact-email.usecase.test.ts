import { SendContactEmailUseCase } from "$domain/usecases/email/send-contact-email.usecase";
import { EmailObject } from "$domain/value-objects/email.value-object";
import { InMemoryEmailRepository } from "$infrastructure/adapters/in-memory/in-memory-email.repository";
import { EmailRepositoryInterface } from "$infrastructure/ports";
import { beforeEach, describe, expect, it } from "@jest/globals";

let emailRepository: EmailRepositoryInterface;

beforeEach(() => {
    emailRepository = new InMemoryEmailRepository();
});

describe("SendContactEmailUseCase", () => {
  it("should throw an error if name is missing", async () => {
    const sendContactEmailUseCase = new SendContactEmailUseCase(emailRepository);

    expect(
      sendContactEmailUseCase.execute("", new EmailObject("john@doe.com"), "toto")
    ).rejects.toThrow("Name is required");
  });

  it("should throw an error if email is missing", async () => {
    const sendContactEmailUseCase = new SendContactEmailUseCase(emailRepository);

    expect(
      sendContactEmailUseCase.execute("John Doe", new EmailObject(""), "toto")
    ).rejects.toThrow("Email sender is required");
  });
  
  it("should throw an error if email is invalid", async () => {
    const sendContactEmailUseCase = new SendContactEmailUseCase(emailRepository);

    expect(
      sendContactEmailUseCase.execute("John Doe", new EmailObject("john@doe"), "toto")
    ).rejects.toThrow("Email sender is invalid");
  });

  it("should throw an error if message is missing", async () => {
    const sendContactEmailUseCase = new SendContactEmailUseCase(
      emailRepository
    );

    expect(
      sendContactEmailUseCase.execute("Toto", new EmailObject("john@doe.com"), "")
    ).rejects.toThrow("Message is required");
  });

  it("should throw an error if message is more than max length", async () => {
    const sendContactEmailUseCase = new SendContactEmailUseCase(
      emailRepository
    );
    const tooLongMessage = "a".repeat(301);

    expect(
      sendContactEmailUseCase.execute("Toto", new EmailObject("john@doe.com"), tooLongMessage)
    ).rejects.toThrow(/Message is too long/g);
  });

  it('should send an email', async () => {
    const sendContactEmailUseCase = new SendContactEmailUseCase(
      emailRepository
    );

    const result = await sendContactEmailUseCase.execute(
      "John Doe",
      new EmailObject("john@doe.com"),
      "successful message"
    );
    expect(result).toEqual({ success: true });
  });
  
});