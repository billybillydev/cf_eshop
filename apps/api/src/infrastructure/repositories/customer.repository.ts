import { config } from "$/config";
import { AppBindings } from "$/config/bindings";
import { customerSchema } from "$/db/schemas/customer.schema";
import { D1DBRepository } from "$/infrastructure/repositories/d1-db.repository";

import { CreateCustomerDTO, CustomerDTO } from "@eshop/business/domain/dtos";
import { CustomerEntity } from "@eshop/business/domain/entities";
import {
  EmailObject,
  FavoriteVO,
  IdObject,
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

  async getById(id: IdObject): Promise<CustomerEntity | null> {
    try {
      const customer = await this.db
        .select()
        .from(customerSchema)
        .where(eq(customerSchema.id, id.value()))
        .get();

      if (!customer) {
        return Promise.resolve(null);
      }

      return CustomerEntity.build(customer);
    } catch (error) {
      console.error(error);
      return Promise.resolve(null);
    }
  }

  async update(
    id: IdObject,
    customerData: Partial<CustomerDTO>
  ): Promise<CustomerEntity | null> {
    try {
      await this.db
        .update(customerSchema)
        .set(customerData)
        .where(eq(customerSchema.id, id.value()));

      return this.getById(id);
    } catch (error) {
      console.error(error);
      return Promise.resolve(null);
    }
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

      const customerData = await this.db.query.customerSchema.findFirst({
        where: (fields, { eq }) => eq(fields.email, email.toString()),
      });

      if (!customerData) {
        return Promise.resolve(null);
      }

      const customer = CustomerEntity.build(customerData);

      if (!(await customer.password.verify(password))) {
        throw new Error("Password verification failed");
      }

      return Promise.resolve(customer);
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

    return CustomerEntity.build(createdCustomer);
  }
}
