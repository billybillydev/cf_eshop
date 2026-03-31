import { CreateCustomerDTO } from "$domain/dtos";
import { CustomerEntity } from "$domain/entities";
import { EmailObject, PasswordObject } from "$domain/value-objects";
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

    const isMatch = await existingCustomer.password.verify(password);

    if (!isMatch) {
      return Promise.resolve(null);
    }

    return Promise.resolve(existingCustomer);
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

    const customer = new CustomerEntity({
      ...customerData,
      id: this.customers.length + 1,
      email: customerData.email,
      password: (
        await new PasswordObject().hash(
          customerData.password
        )
      ).toString(),
    });
    this.customers.push(customer);

    return Promise.resolve(customer);
  }

  async isAdmin(email: EmailObject): Promise<boolean> {
    const user = this.customers.find((user) => user.email.equals(email));

    if (!user) {
      return Promise.resolve(false);
    }

    return Promise.resolve(email.equals(this.adminEmail));
  }
}
