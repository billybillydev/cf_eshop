import { AppVariables } from "$config/variables";
import { UserRepository } from "$infrastructure/repositories/user.repository";
import { UserDTO } from "@eshop/business/domain/dtos";
import { IsUserAdminUseCase } from "@eshop/business/domain/usecases/user";
import { MiddlewareHandler } from "hono";

export const adminMiddleware: MiddlewareHandler<{
  Variables: AppVariables;
}> = async (c, next) => {
  console.log("in admin middleware");
  try {
    const payload = c.get("jwtPayload");

    if (!payload) {
      c.status(401);
      await next();
    }

    if (payload && "user" in payload) {
      const userRepository = new UserRepository();
      const isUserAdmibUseCase = new IsUserAdminUseCase(userRepository);
      const isAdmin = await isUserAdmibUseCase.execute(
        (payload.user as UserDTO).email
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
