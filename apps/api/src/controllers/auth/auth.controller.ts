import { AppContext, config } from "$/config";
import { CustomerRepository } from "$/infrastructure/repositories/customer.repository";
import {
  CustomerEntity,
  SanitizedCustomerEntity,
} from "@eshop/business/domain/entities";
import {
  CreateCustomerUseCase,
  GetCustomerByEmailUseCase,
  IsUserAdminUseCase,
} from "@eshop/business/domain/usecases/customer";
import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";

export const authController = new Hono<AppContext>()
  .post(
    "/token",
    zValidator(
      "json",
      z.object({
        email: z.string({ message: "Email is required" }),
        password: z.string({ message: "Password is required" }),
      })
    ),
    async (ctx) => {
      try {
        const body = ctx.req.valid("json");
        const customerRepository = new CustomerRepository(ctx.env.DB);
        const getCustomerByEmailUseCase = new GetCustomerByEmailUseCase(
          customerRepository
        );
        const customer = await getCustomerByEmailUseCase.execute(
          body.email,
          body.password
        );

        if (!customer) {
          return failedResponse(ctx, "Invalid credentials", 401);
        }

        return generateToken(ctx, customer, 200);
      } catch (error) {
        console.log({ error });
      }
    }
  )
  .post(
    "/admin",
    zValidator(
      "json",
      z.object({
        email: z.string({ message: "Email is required" }),
      })
    ),
    async (ctx) => {
      try {
        const body = ctx.req.valid("json");
        const customerRepository = new CustomerRepository(ctx.env.DB);
        const isUserAdminUseCase = new IsUserAdminUseCase(customerRepository);
        const isAdmin = await isUserAdminUseCase.execute(body.email);

        if (!isAdmin) {
          return failedResponse(ctx, "User is not admin", 401);
        }

        return ctx.json({ isAdmin }, 200);
      } catch (error) {
        console.log({ error });
      }
    }
  )
  .post(
    "/account",
    zValidator(
      "json",
      z.object({
        username: z.string(),
        firstname: z.string(),
        email: z.string(),
        password: z.string(),
      })
    ),
    async (ctx) => {
      try {
        const body = ctx.req.valid("json");
        const customerRepository = new CustomerRepository(ctx.env.DB);
        const createCustomerUseCase = new CreateCustomerUseCase(
          customerRepository
        );
        const customer = await createCustomerUseCase.execute(body);

        if (!customer) {
          return failedResponse(ctx, "User already exists", 400);
        }

        return generateToken(ctx, customer, 201);
      } catch (error) {
        const err = error as Error;
        console.log(err);
        return failedResponse(ctx, "Internal Server error", 500);
      }
    }
  )
  .delete("/logout", async (ctx) => {
    deleteCookie(ctx, "jwtPayload");
    return ctx.json({ message: "Logout successful" });
  });

async function failedResponse<T extends Context>(
  ctx: T,
  message: string,
  status: ContentfulStatusCode
) {
  return ctx.json({ error: message }, status);
}

async function generateToken<T extends Context>(
  ctx: T,
  customer: CustomerEntity,
  status: ContentfulStatusCode
) {
  const token = await sign(
    {
      user: new SanitizedCustomerEntity(
        customer.transformToDTO()
      ).transformToDTO(),
      exp: Math.floor(Date.now() / 1000) + 60 * 24 * 30,
    },
    config.jwtSecret
  );

  setCookie(ctx, "jwtPayload", token);

  return ctx.json({ token }, status);
}

// class AuthController extends Hono<AppContext> {
//   constructor() {
//     super();
//     this.post(
//       "/token",
//       zValidator(
//         "json",
//         z.object({
//           email: z.string({ message: "Email is required" }),
//           password: z.string({ message: "Password is required" }),
//         })
//       ),
//       this.token
//     );
//     this.post("/admin", this.admin);
//     this.post("/account", this.account);
//     this.delete("/logout", this.logout);
//   }
//   async token(ctx: Context<AppContext>) {
//     try {
//       const body = ctx.req.valid("json");
//       const customerRepository = new CustomerRepository(ctx.env.DB);
//       const getCustomerByEmailUseCase = new GetCustomerByEmailUseCase(
//         customerRepository
//       );
//       const customer = await getCustomerByEmailUseCase.execute(
//         body.email,
//         body.password
//       );

//       if (!customer) {
//         return failedResponse(ctx, "Invalid credentials", 401);
//       }

//       return generateToken(ctx, customer, 200);
//     } catch (error) {
//       console.log({ error });
//     }
//   }
//   admin(arg0: string, admin: any) {
//     throw new Error("Method not implemented.");
//   }
//   account(arg0: string, account: any) {
//     throw new Error("Method not implemented.");
//   }
//   logout(arg0: string, logout: any) {
//     throw new Error("Method not implemented.");
//   }
// }
