import { AppVariables } from "$config/variables";
import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { bearerAuth } from "hono/bearer-auth";

export const tokenMiddleware: MiddlewareHandler<{
  Variables: AppVariables;
}> = async (c, next) => {
  const token = getCookie(c, "jwtPayload");
  if (token) {
    bearerAuth({ token })
  }
  await next();
};
