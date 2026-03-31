import { CreateCustomerDTO } from "$domain/dtos/customer";
import { CustomerEntity } from "$domain/entities";
import { EmailObject } from "$domain/value-objects";

export interface CustomerRepositoryInterface {
    isAdmin(email: EmailObject): Promise<boolean>;
    getByEmail(email: EmailObject, password: string): Promise<CustomerEntity | null>;
    create(userData: CreateCustomerDTO): Promise<CustomerEntity | null>;
}