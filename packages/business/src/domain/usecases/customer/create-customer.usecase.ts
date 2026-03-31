import { CreateCustomerDTO } from "$domain/dtos/customer";
import { CustomerEntity } from "$domain/entities";
import { CustomerRepositoryInterface } from "$infrastructure/ports/customer.repository.interface";

export class CreateCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface
  ) {}

  async execute(
    customerData: CreateCustomerDTO
  ): Promise<CustomerEntity | null> {
    return this.customerRepository.create(customerData);
  }
}