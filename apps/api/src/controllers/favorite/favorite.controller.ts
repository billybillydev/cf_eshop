import {
  AddProductToCustomerFavoriteUseCase,
  DeleteFavoriteUseCase,
  GetCustomerFavoritesUseCase,
} from "@eshop/business/domain/usecases/customer";
import type { AppContext } from "$/config";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { CustomerRepository } from "$/infrastructure/repositories/customer.repository";
import { FavoriteRepository } from "$/infrastructure/repositories/favorite.repository";
import { ProductRepository } from "$/infrastructure/repositories/product.repository";
import { jwtMiddleware } from "$/middlewares/jwt.middleware";
import { tokenMiddleware } from "$/middlewares/token.middleware";

export const favoriteApiController = new Hono<AppContext>()
  .use(tokenMiddleware)
  .use(jwtMiddleware)
  .get("/", async (ctx) => {
    const jwtPayload = ctx.get("jwtPayload");
    const customerId = jwtPayload.user.id;
    const favoriteRepository = new FavoriteRepository(ctx.env.DB);

    const useCase = new GetCustomerFavoritesUseCase(favoriteRepository);

    const favorites = await useCase.execute({ customerId });

    return ctx.json(favorites.map((f) => f.transformToDTO()));
  })
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        productId: z.number(),
      })
    ),
    async (ctx) => {
      try {
        const jwtPayload = ctx.get("jwtPayload");
        const customerId = jwtPayload.user.id;
        const { productId } = ctx.req.valid("json");
        const customerRepository = new CustomerRepository(ctx.env.DB);
        const productRepository = new ProductRepository(ctx.env.DB);
        const favoriteRepository = new FavoriteRepository(ctx.env.DB);

        const useCase = new AddProductToCustomerFavoriteUseCase(
          customerRepository,
          productRepository,
          favoriteRepository
        );

        const result = await useCase.execute({
          customerId,
          productId,
        });

        return ctx.json(result, 200);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to add favorite";
        return ctx.json({ error: message, success: false }, 400);
      }
    }
  )
  .delete(
    "/",
    zValidator(
      "query",
      z.object({
        productId: z.coerce.number(),
      })
    ),
    async (ctx) => {
      try {
        const { productId } = ctx.req.valid("query");
        const jwtPayload = ctx.get("jwtPayload");
        const customerId = jwtPayload.user.id;
        const customerRepository = new CustomerRepository(ctx.env.DB);
        const productRepository = new ProductRepository(ctx.env.DB);
        const favoriteRepository = new FavoriteRepository(ctx.env.DB);

        const useCase = new DeleteFavoriteUseCase(
          customerRepository,
          productRepository,
          favoriteRepository
        );

        const result = await useCase.execute({
          customerId,
          productId,
        });

        return ctx.json(result, 200);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete favorite";
        return ctx.json({ error: message, success: false }, 404);
      }
    }
  );

  