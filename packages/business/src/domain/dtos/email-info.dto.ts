import { EmailEntity } from "$domain/entities/email-info.entity";

export type EmailDTO = {
  from: ReturnType<EmailEntity["from"]["toString"]>;
  to: ReturnType<EmailEntity["to"]["toString"]>;
  subject: EmailEntity["subject"];
  text: EmailEntity["text"];
  html?: EmailEntity["html"];
};