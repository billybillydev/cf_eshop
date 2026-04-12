import { AppContext } from "$/config";
import { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";

export const jwtMiddleware: MiddlewareHandler<AppContext> = async (c, next) => {
  const middleware = jwt({ secret: c.env.JWT_SECRET, cookie: "jwtPayload", alg: "HS256" });
  return middleware(c, next);
};