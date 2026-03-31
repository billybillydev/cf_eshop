import { ProductItemEntity } from "@eshop/business/domain/entities";
import {
  GetProductByCodeUseCase,
  GetProductByIdUseCase,
  ShowProductsUseCase
} from "@eshop/business/domain/usecases/product";
import { IdObject } from "@eshop/business/domain/value-objects";

import { zValidator } from "@hono/zod-validator";

import { AppContext, config } from "$config";
import { ProductRepository } from "$infrastructure/repositories/product.repository";
import { Hono } from "hono";
import { z } from "zod";

export const productApiController = new Hono<AppContext>()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        category: z.string().optional(),
        productName: z.string().optional(),
      })
    ),
    async (ctx) => {
      let products: ProductItemEntity[] = [];
      const filters = ctx.req.valid("query");

      const productApiRepository = new ProductRepository(ctx.env.DB);

      const showProductsUseCase = new ShowProductsUseCase(productApiRepository);

      if (Object.keys(filters).length) {
        [products] = await showProductsUseCase.execute(filters);
      } else {
        products = await showProductsUseCase.execute();
      }

      return ctx.json(products.map((product) => product.transformToDTO()));
    }
  )
  .get(
    "/paginate",
    zValidator(
      "query",
      z.object({
        productName: z.string().optional(),
        category: z.string().optional(),
        page: z.coerce.number().default(config.defaultPage),
        limit: z.coerce
          .number()
          .optional()
          .transform((val) =>
            val && config.defaultLimits.includes(val)
              ? val
              : config.defaultLimits[0]
          ),
      })
    ),
    async (ctx) => {
      const queries = ctx.req.valid("query");

      const productApiRepository = new ProductRepository(ctx.env.DB);

      const showProductsUseCase = new ShowProductsUseCase(productApiRepository);

      const [products, total] = await showProductsUseCase.execute(queries);

      return ctx.json([
        products.map((product) => product.transformToDTO()),
        total,
      ]);
    }
  )
  .get(
    "/code/:code",
    zValidator(
      "param",
      z.object({
        code: z.string(),
      })
    ),
    async (ctx) => {
      const { code } = ctx.req.valid("param");
      const productApiRepository = new ProductRepository(ctx.env.DB);
      const getProductByCodeUseCase = new GetProductByCodeUseCase(
        productApiRepository
      );

      const product = await getProductByCodeUseCase.execute(code);

      if (!product) {
        return ctx.json(null);
      }

      return ctx.json(product.transformToDTO());
    }
  )
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
      const productApiRepository = new ProductRepository(ctx.env.DB);
      const getProductByIdUseCase = new GetProductByIdUseCase(
        productApiRepository
      );

      const product = await getProductByIdUseCase.execute(new IdObject(id));

      if (!product) {
        return ctx.json(null);
      }

      return ctx.json(product.transformToDTO());
    }
  );