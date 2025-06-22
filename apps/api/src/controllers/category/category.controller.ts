import { env } from "$config";
import { AppVariables } from "$config/variables";
import { CategoryRepository } from "$infrastructure/repositories/category.repository";
import { tokenMiddleware } from "$middlewares/token.middleware";
import {
  GetAllCategoriesUseCase,
  GetCategoryByIdUseCase,
} from "@eshop/business/domain/usecases/category";
import { IdObject } from "@eshop/business/domain/value-objects";

import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { z } from "zod";

export const categoryApiController = new Hono<{ Variables: AppVariables }>()
.use(tokenMiddleware)
  .use(jwt({ secret: env.JWT_SECRET, cookie: "jwtPayload" }))
  .get(async (ctx) => {
    const categoryApiRepository = new CategoryRepository();
    const getAllCategoriesUseCase = new GetAllCategoriesUseCase(
      categoryApiRepository
    );

    const categories = await getAllCategoriesUseCase.execute();

    return ctx.json(categories.map((category) => category.transformToDTO()));
  })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.coerce.number(),
      })
    ),
    async (ctx) => {
      const { id } = ctx.req.valid("param");
      const categoryApiRepository = new CategoryRepository();
      const getCategoryByIdUseCase = new GetCategoryByIdUseCase(
        categoryApiRepository
      );

      const category = await getCategoryByIdUseCase.execute(new IdObject(id));

      if (!category) {
        return ctx.json(null);
      }

      return ctx.json(category.transformToDTO());
    }
  );
