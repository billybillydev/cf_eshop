import { EmailObject } from "$domain/value-objects/email.value-object";
import { EmailRepositoryInterface } from "$infrastructure/ports";

export class SendContactEmailUseCase {
    constructor(private readonly emailRepository: EmailRepositoryInterface) {}

    async execute(name: string, email: EmailObject, message: string): Promise<{ success: boolean }> {
        return this.emailRepository.sendContactEmail(name, email, message);
    }
}