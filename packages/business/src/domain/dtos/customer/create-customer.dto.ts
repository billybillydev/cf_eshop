import { CustomerDTO } from "$domain/dtos/customer/customer.dto";

export type CreateCustomerDTO = Omit<
    CustomerDTO,
    "id" | "createdAt" | "updatedAt"
>;