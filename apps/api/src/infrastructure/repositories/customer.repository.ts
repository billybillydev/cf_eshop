import { config } from "$config";
import { AppBindings } from "$config/bindings";
import { Customer, customerSchema } from "$db/schemas/customer.schema";
import { D1DBRepository } from "$infrastructure/repositories/d1-db.repository";
import { CreateCustomerDTO } from "@eshop/business/domain/dtos";
import { CustomerEntity } from "@eshop/business/domain/entities";
import {
  EmailObject,
  PasswordObject,
} from "@eshop/business/domain/value-objects";
import { CustomerRepositoryInterface } from "@eshop/business/infrastructure/ports";
import { eq } from "drizzle-orm";

export class CustomerRepository
  extends D1DBRepository
  implements CustomerRepositoryInterface
{
  constructor(bindingName: AppBindings["DB"]) {
    super(bindingName);
  }

  async isAdmin(email: EmailObject): Promise<boolean> {
    try {
      const customer = await this.db.query.customerSchema.findFirst({
        where: (fields, { eq }) => eq(fields.email, email.toString()),
      });
      if (!customer) {
        console.error("Customer does not exist");
        return Promise.resolve(false);
      }

      return Promise.resolve(email.equals(new EmailObject(config.adminEmail)));
    } catch (error) {
      console.log(error);
      return Promise.resolve(false);
    }
  }

  async getByEmail(
    email: EmailObject,
    password: string
  ): Promise<CustomerEntity | null> {
    try {
      if (!email.isValid()) {
        console.error("Invalid email");

        return Promise.resolve(null);
      }

      const {
        results: [customer],
      } = await this.db
        .select()
        .from(customerSchema)
        .where((fields) => eq(fields.email, email.toString()))
        .limit(1)
        .run();

      if (!customer) {
        return Promise.resolve(null);
      }

      console.log("In getByEmail : ", JSON.stringify(customer, null, 2));

      const customerEntity = new CustomerEntity(customer);

      if (!(await customerEntity.password.verify(password))) {
        console.log("\n\nverification failed\n\n");
        return Promise.resolve(null);
      }

      return Promise.resolve(customerEntity);
    } catch (error) {
      console.error(error);
      return Promise.resolve(null);
    }
  }

  async create(
    customerData: CreateCustomerDTO
  ): Promise<CustomerEntity | null> {
    const existingCustomer = await this.getByEmail(
      new EmailObject(customerData.email),
      customerData.password
    );
    console.log("In create : ", existingCustomer)
    if (existingCustomer) {
      console.error("User already exists");
      return Promise.resolve(null);
    }

    const [createdCustomer] = await this.db
      .insert(customerSchema)
      .values({
        username: customerData.username,
        firstname: customerData.firstname,
        email: customerData.email,
        password: (
          await new PasswordObject().hash(customerData.password)
        ).toString(),
      })
      .returning();

    return this.convertModelToEntity(createdCustomer);
  }

  private async convertModelToEntity(
    customer: Customer
  ): Promise<CustomerEntity> {
    return new CustomerEntity(customer);
  }
}
