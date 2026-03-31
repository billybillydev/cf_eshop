import { AppContext } from "$config";
import { CategoryRepository } from "$infrastructure/repositories/category.repository";
import {
  GetAllCategoriesUseCase,
  GetCategoryByIdUseCase,
} from "@eshop/business/domain/usecases/category";
import { IdObject } from "@eshop/business/domain/value-objects";

import { zValidator } from "@hono/zod-validator";

import { Hono } from "hono";
import { z } from "zod";

export const categoryApiController = new Hono<AppContext>()
  .get(async (ctx) => {
    const categoryApiRepository = new CategoryRepository(ctx.env.DB);
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
      const categoryApiRepository = new CategoryRepository(ctx.env.DB);
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
