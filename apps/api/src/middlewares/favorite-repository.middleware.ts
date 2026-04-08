import { AppContext } from "$config";
import { FavoriteRepository } from "$infrastructure/repositories/favorite.repository";
import { MiddlewareHandler } from "hono";

export const favoriteRepositoryMiddleware: MiddlewareHandler<AppContext> = async (
  c,
  next
) => {
  c.set("favoriteRepository", new FavoriteRepository(c.env.DB));
  await next();
};
