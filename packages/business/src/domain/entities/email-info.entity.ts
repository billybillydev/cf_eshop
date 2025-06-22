import { EmailDTO } from "$domain/dtos";
import { EmailObject } from "$domain/value-objects/email.value-object";

export class EmailEntity {
  constructor(
    private readonly from: EmailObject,
    private readonly to: EmailObject,
    private readonly subject: string,
    private readonly text: string,
    private readonly html?: string
  ) {
    if (!from.toString()) {
      throw new Error("Email sender is required");
    }
    if (!from.isValid()) {
      throw new Error("Email sender is invalid");
    }
    if (!to.toString()) {
      throw new Error("Email sender is required");
    }
    if (!to.isValid()) {
      throw new Error("Email sender is invalid");
    }
    if (!subject) {
      throw new Error("Subject is required");
    }
    if (!text) {
      throw new Error("Message is required");
    }
  }

  transformToDTO(): EmailDTO {
    return {
      from: this.from.toString(),
      to: this.to.toString(),
      subject: this.subject,
      text: this.text,
      html: this.html,
    };
  }
}
