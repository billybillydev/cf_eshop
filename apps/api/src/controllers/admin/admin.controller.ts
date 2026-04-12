
import { AppContext } from "$/config";
import { ProductRepository } from "$/infrastructure/repositories/product.repository";
import { adminMiddleware } from "$/middlewares/admin.middleware";
import { jwtMiddleware } from "$/middlewares/jwt.middleware";
import { tokenMiddleware } from "$/middlewares/token.middleware";
import {
  CreateProductUseCase,
  RemoveProductUseCase,
  UpdateProductUseCase,
} from "@eshop/business/domain/usecases/product";
import { IdObject } from "@eshop/business/domain/value-objects";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

const paramIdSchemaValidator = zValidator(
  "param",
  z.object({
    id: z.coerce.number(),
  })
);

export const adminController = new Hono<AppContext>()
  .use(tokenMiddleware)
  .use(jwtMiddleware)
  .use(adminMiddleware)
  .post(
    zValidator(
      "json",
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.coerce.number(),
        image: z.string(),
        shellId: z.coerce.number(),
        quantity: z.coerce.number().optional(),
        internalReference: z.string(),
        category: z.object({
          id: z.coerce.number(),
          name: z.string(),
        }),
        rating: z.coerce.number().optional(),
      })
    ),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const createProductUseCase = new CreateProductUseCase(
        new ProductRepository(ctx.env.DB)
      );

      const product = await createProductUseCase.execute(body);

      return ctx.json(product.transformToDTO());
    }
  )
  .patch(
    paramIdSchemaValidator,
    zValidator(
      "json",
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.coerce.number().optional(),
        image: z.string().optional(),
        shellId: z.coerce.number().optional(),
        quantity: z.coerce.number().optional(),
        internalReference: z.string().optional(),
        category: z
          .object({
            id: z.coerce.number(),
            name: z.string(),
          })
          .optional(),
        rating: z.coerce.number().optional(),
      })
    ),
    async (ctx) => {
      const { id } = ctx.req.valid("param");
      const body = ctx.req.valid("json");
      const updateProductUseCase = new UpdateProductUseCase(
        new ProductRepository(ctx.env.DB)
      );

      const product = await updateProductUseCase.execute(
        new IdObject(id),
        body
      );

      return ctx.json(product.transformToDTO());
    }
  )
  .delete(paramIdSchemaValidator, async (ctx) => {
    const { id } = ctx.req.valid("param");

    const productApiRepository = new ProductRepository(ctx.env.DB);
    const removeProductUseCase = new RemoveProductUseCase(productApiRepository);
    const deletedProduct = await removeProductUseCase.execute(new IdObject(id));

    return ctx.json(deletedProduct.transformToDTO());
  });
