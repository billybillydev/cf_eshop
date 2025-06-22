import { JwtRepository } from "$infrastructure/repositories/jwt.repository";
import { FetchApi } from "@eshop/application";
import { CreateUserDTO } from "@eshop/business/domain/dtos";
import { UserEntity } from "@eshop/business/domain/entities";
import { EmailObject } from "@eshop/business/domain/value-objects";
import { UserRepositoryInterface } from "@eshop/business/infrastructure/ports";
import z from "zod";

type JwtTokenResponse =
  | {
      success: true;
      token: string;
    }
  | {
      success: false;
      error: string;
    };

export class UserRepository
  extends JwtRepository
  implements UserRepositoryInterface
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

  isAdmin(email: EmailObject): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  getByEmail(email: EmailObject, password: string): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }

  create(userData: CreateUserDTO): Promise<UserEntity> {
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
