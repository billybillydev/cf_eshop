import { AppContext } from "$/config";
import { CustomerRepository } from "$/infrastructure/repositories/customer.repository";
import { jwtMiddleware } from "$/middlewares/jwt.middleware";
import { tokenMiddleware } from "$/middlewares/token.middleware";
import { GetCustomerByIdUseCase } from "@eshop/business/domain/usecases/customer";
import { Hono } from "hono";

export const customerController = new Hono<AppContext>();

customerController
  .use(tokenMiddleware)
  .use(jwtMiddleware)
  .get(
    "/",
    async (ctx) => {
      const jwtPayload = ctx.get("jwtPayload");
      const customerId = jwtPayload.user.id;
      const repository = new CustomerRepository(ctx.env.DB);
      const useCase = new GetCustomerByIdUseCase(repository);
      const customer = await useCase.execute(customerId);

      if (!customer) {
        return ctx.json({ error: "Customer not found" }, 404);
      }

      return ctx.json(customer.transformToDTO());
    }
  );
