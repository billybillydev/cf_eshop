import { CustomerEntity } from "$domain/entities";
import { IdObject } from "$domain/value-objects";
import { CustomerRepositoryInterface } from "$infrastructure/ports/customer.repository.interface";

export class GetCustomerByIdUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryInterface) {}

  async execute(id: number): Promise<CustomerEntity | null> {
    return this.customerRepository.getById(new IdObject(id));
  }
}
