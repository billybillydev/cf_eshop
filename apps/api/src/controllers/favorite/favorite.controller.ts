import { AppContext } from "$config";
import { favoriteRepositoryMiddleware } from "$middlewares/favorite-repository.middleware";
import {
  AddFavoriteUseCase,
  DeleteFavoriteUseCase,
  GetFavoritesUseCase,
} from "@eshop/business/domain/usecases/favorite";
import { IdObject } from "@eshop/business/domain/value-objects";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const favoriteApiController = new Hono<AppContext>()
  .use(favoriteRepositoryMiddleware)
  .get(
    "/:customerId",
    zValidator(
      "param",
      z.object({
        customerId: z.coerce.number(),
      })
    ),
    async (ctx) => {
      const { customerId } = ctx.req.valid("param");
      const repository = ctx.get("favoriteRepository");
      const useCase = new GetFavoritesUseCase(repository);

      const favorites = await useCase.execute(new IdObject(customerId));

      return ctx.json(favorites.map((f) => f.transformToDTO()));
    }
  )
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        productId: z.number(),
        customerId: z.number(),
        productImage: z.string(),
        inventoryStatus: z.enum(["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"]),
      })
    ),
    async (ctx) => {
      try {
        const body = ctx.req.valid("json");
        const repository = ctx.get("favoriteRepository");
        const useCase = new AddFavoriteUseCase(repository);

        const favorite = await useCase.execute(body);

        return ctx.json(favorite.transformToDTO(), 201);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to add favorite";
        return ctx.json({ error: message }, 400);
      }
    }
  )
  .delete(
    "/",
    zValidator(
      "json",
      z.object({
        customerId: z.number(),
        productId: z.number(),
      })
    ),
    async (ctx) => {
      try {
        const { customerId, productId } = ctx.req.valid("json");
        const repository = ctx.get("favoriteRepository");
        const useCase = new DeleteFavoriteUseCase(repository);

        const deleted = await useCase.execute(
          new IdObject(customerId),
          new IdObject(productId)
        );

        return ctx.json(deleted.transformToDTO());
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to delete favorite";
        return ctx.json({ error: message }, 404);
      }
    }
  );
