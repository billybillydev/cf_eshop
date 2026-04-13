import { CustomerDTO } from "$domain/dtos/customer/customer.dto";

export type SanitizedCustomerDTO = Omit<CustomerDTO, "password">;
