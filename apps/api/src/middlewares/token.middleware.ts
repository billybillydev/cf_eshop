import { AppVariables } from "$config/variables";
import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { bearerAuth } from "hono/bearer-auth";

export const tokenMiddleware: MiddlewareHandler<{
  Variables: AppVariables;
}> = async (c, next) => {
  const bearer = bearerAuth({
    verifyToken(token, c) {
      const cookieToken = getCookie(c, "jwtPayload");
      return cookieToken === token;
    },
  });
  return bearer(c, next);
};
