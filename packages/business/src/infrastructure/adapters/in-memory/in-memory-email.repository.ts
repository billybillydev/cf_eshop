import { EmailEntity } from "$domain/entities/email-info.entity";
import { EmailObject } from "$domain/value-objects/email.value-object";
import { EmailRepositoryInterface } from "$infrastructure/ports";

export class InMemoryEmailRepository implements EmailRepositoryInterface {
  private readonly eShopEmail = "contact@eshop.com";
  async sendContactEmail(name: string, email: EmailObject, message: string): Promise<{ success: boolean; }> {
    const maxMessageLength = 300;
    if (!name) {
      throw new Error("Name is required");
    }
    if (message.length > maxMessageLength) {
      throw new Error(`Message is too long, max is ${maxMessageLength} characters`);      
    }
    const emailInfo = new EmailEntity(
      email,
      new EmailObject(this.eShopEmail),
      `Contact: You have a new message from ${name}`,
      message
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return Promise.resolve({ success: true });
  }
}
