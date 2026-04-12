import { AppContext } from "$/config";
import { CustomerRepository } from "$/infrastructure/repositories/customer.repository";
import { CustomerDTO } from "@eshop/business/domain/dtos";
import { IsUserAdminUseCase } from "@eshop/business/domain/usecases/customer";
import { MiddlewareHandler } from "hono";

export const adminMiddleware: MiddlewareHandler<AppContext> = async (c, next) => {
  console.log("in admin middleware");
  try {
    const payload = c.get("jwtPayload");

    if (!payload) {
      c.status(401);
      await next();
    }

    if (payload && "user" in payload) {
      const userRepository = new CustomerRepository(c.env.DB);
      const isUserAdmibUseCase = new IsUserAdminUseCase(userRepository);
      const isAdmin = await isUserAdmibUseCase.execute(
        (payload.user as CustomerDTO).email
      );
      if (!isAdmin) {
        console.error("User is not admin")
        return c.json({ message: "Unauthorized" }, 401);
      }
      await next();
    }
  } catch (error) {
    console.error(error);
    return c.json({ message: "Unauthorized" }, 401);
  }
};
