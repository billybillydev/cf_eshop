import { CreateCustomerDTO, CustomerDTO } from "$domain/dtos";
import { CustomerEntity } from "$domain/entities";
import { EmailObject, FavoriteVO, IdObject, PasswordObject } from "$domain/value-objects";
import { CustomerRepositoryInterface } from "$infrastructure/ports/customer.repository.interface";

export class InMemoryCustomerRepository implements CustomerRepositoryInterface {
  readonly customers: CustomerEntity[] = [];
  private readonly adminEmail = new EmailObject("admin@eshop.com");

  async getByEmail(
    email: EmailObject,
    password: string
  ): Promise<CustomerEntity | null> {
    if (!email.isValid()) {
      throw new Error("Invalid email");
    }
    const existingCustomer = this.customers.find(
      (customer) => customer.email.toString() === email.toString()
    );

    if (!existingCustomer) {
      return Promise.resolve(null);
    }

    const isMatch = await existingCustomer.verifyPassword(password);

    if (!isMatch) {
      return Promise.resolve(null);
    }

    return Promise.resolve(existingCustomer);
  }

  async getById(id: IdObject): Promise<CustomerEntity | null> {
    const existingCustomer = this.customers.find((customer) =>
      customer.id.equals(id)
    );
    return Promise.resolve(existingCustomer || null);
  }

  async create(
    customerData: CreateCustomerDTO
  ): Promise<CustomerEntity | null> {
    if (
      this.customers.some(
        (customer) => customer.email.toString() === customerData.email
      )
    ) {
      console.log("User already exists");
      return Promise.resolve(null);
    }

    for (const field in customerData) {
      if (!Reflect.get(customerData, field)) {
        throw new Error(`Field ${field} is required`);
      }
    }

    const customer = CustomerEntity.build({
      ...customerData,
      id: this.customers.length + 1,
      email: customerData.email,
      password: (
        await new PasswordObject().hash(customerData.password)
      ).toString(),
    });
    this.customers.push(customer);

    return Promise.resolve(customer);
  }

  async update(
    id: IdObject,
    customerData: Partial<CustomerDTO>
  ): Promise<CustomerEntity | null> {
    const existingCustomer = this.customers.find((customer) =>
      customer.id.equals(id)
    );
    if (!existingCustomer) {
      return Promise.resolve(null);
    }
    const dto = existingCustomer.transformToDTO();
    Object.assign(dto, customerData);

    return Promise.resolve(new CustomerEntity(dto));
  }

  async isAdmin(email: EmailObject): Promise<boolean> {
    const user = this.customers.find((user) => user.email.equals(email));

    if (!user) {
      return Promise.resolve(false);
    }

    return Promise.resolve(email.equals(this.adminEmail));
  }
}
