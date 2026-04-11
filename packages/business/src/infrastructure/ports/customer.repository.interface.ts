import { CreateCustomerDTO, CustomerDTO } from "$domain/dtos/customer";
import { CustomerEntity } from "$domain/entities";
import { EmailObject, FavoriteVO, IdObject } from "$domain/value-objects";

export interface CustomerRepositoryInterface {
  isAdmin(email: EmailObject): Promise<boolean>;
  getByEmail(
    email: EmailObject,
    password: string
  ): Promise<CustomerEntity | null>;
  getById(id: IdObject): Promise<CustomerEntity | null>;
  create(userData: CreateCustomerDTO): Promise<CustomerEntity | null>;
  update(
    id: IdObject,
    customerData: Partial<CustomerDTO>
  ): Promise<CustomerEntity | null>;
}