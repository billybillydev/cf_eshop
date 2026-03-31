import { CustomerEntity } from "$domain/entities";
import { EmailObject } from "$domain/value-objects";
import { CustomerRepositoryInterface } from "$infrastructure/ports/customer.repository.interface";

export class GetCustomerByEmailUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryInterface) {}

  async execute(email: string, password: string): Promise<CustomerEntity | null> {
    return this.customerRepository.getByEmail(
      new EmailObject(email),
      password
    );
  }
}
