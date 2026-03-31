import { EmailObject } from "$domain/value-objects";
import { CustomerRepositoryInterface } from "$infrastructure/ports/customer.repository.interface";

export class IsUserAdminUseCase {
    constructor(private readonly customerRepository: CustomerRepositoryInterface) {}

    async execute(email: string): Promise<boolean> {
        return this.customerRepository.isAdmin(new EmailObject(email));
    }
}