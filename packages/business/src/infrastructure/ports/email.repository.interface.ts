import { EmailObject } from "$domain/value-objects/email.value-object";

export interface EmailRepositoryInterface {
    sendContactEmail(name: string, email: EmailObject, message: string): Promise<{ success: boolean }>;
}