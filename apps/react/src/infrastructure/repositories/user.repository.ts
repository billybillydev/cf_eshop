import { JwtRepository } from "$/infrastructure/repositories/jwt.repository";
import { FetchApi } from "@eshop/application";
import { CreateCustomerDTO, CustomerDTO } from "@eshop/business/domain/dtos";
import { CustomerEntity } from "@eshop/business/domain/entities";
import { EmailObject, IdObject } from "@eshop/business/domain/value-objects";
import { CustomerRepositoryInterface } from "@eshop/business/infrastructure/ports";
import z from "zod";

const customerDTOSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  firstname: z.string(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  orders: z.array(z.any()),
  favorites: z.array(z.any()),
})

type JwtTokenResponse =
  | {
      success: true;
      token: string;
    }
  | {
      success: false;
      error: string;
    };

export class CustomerRepository
  extends JwtRepository
  implements CustomerRepositoryInterface
{
  readonly #api: FetchApi;

  constructor() {
    const api = new FetchApi({
      defaultOptions: {
        headers: {
          "Content-Type": "application/json",
        },
      },
    });
    super(api);
    this.#api = api;
  }

  async getById(id: IdObject): Promise<CustomerEntity | null> {
    try {
      const customer = await this.#api.get<CustomerDTO | null>(
        `/api/customers`,
        customerDTOSchema
      );

      if (!customer) {
        return null;
      }

      console.log({ customer })
      
      return new CustomerEntity(customer);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  update(id: IdObject, customerData: Partial<CustomerDTO>): Promise<CustomerEntity | null> {
    throw new Error("Method not implemented.");
  }

  isAdmin(email: EmailObject): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  getByEmail(email: EmailObject, password: string): Promise<CustomerEntity | null> {
    throw new Error("Method not implemented.");
  }

  create(customerData: CreateCustomerDTO): Promise<CustomerEntity> {
    throw new Error("Method not implemented.");
  }

  async login(email: EmailObject, password: string): Promise<JwtTokenResponse> {
    const tokenSchema = z.object({
      token: z.string(),
    });
    try {
      const res = await this.#api.post<z.infer<typeof tokenSchema>>(
        "/api/authenticate/token",
        tokenSchema,
        {
          body: JSON.stringify({
            email: email.toString(),
            password: password,
          }),
        }
      );

      if (!res) {
        throw new Error("Error");
      }

      return { success: true, ...res };
    } catch (error: unknown) {
      console.error({ error });
      return {
        success: false,
        error: (error as { cause: { error: string } }).cause.error,
      };
    }
  }

  async register(
    username: string,
    firstname: string,
    email: EmailObject,
    password: string
  ): Promise<JwtTokenResponse> {
    const tokenSchema = z.object({
      token: z.string(),
    });
    try {
      const res = await this.#api.post<z.infer<typeof tokenSchema>>(
        "/api/authenticate/account",
        tokenSchema,
        {
          body: JSON.stringify({
            username,
            firstname,
            email: email.toString(),
            password: password,
          }),
        }
      );

      if (!res) {
        throw new Error("Error");
      }

      return { success: true, ...res };
    } catch (error: unknown) {
      console.error({ error });
      return {
        success: false,
        error: (error as { cause: { error: string } }).cause.error,
      };
    }
  }
}
