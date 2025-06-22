import { ProductItemEntity } from "@eshop/business/domain/entities";
import {
  CreateProductUseCase,
  GetProductByCodeUseCase,
  GetProductByIdUseCase,
  RemoveProductUseCase,
  ShowProductsUseCase,
  UpdateProductUseCase,
} from "@eshop/business/domain/usecases/product";
import { IdObject } from "@eshop/business/domain/value-objects";

import { zValidator } from "@hono/zod-validator";

import { env } from "$config";
import { Hono } from "hono";
import { z } from "zod";
import { ProductRepository } from "$infrastructure/repositories/product.repository";
import { jwt } from "hono/jwt";
import { tokenMiddleware } from "$middlewares/token.middleware";
import { adminMiddleware } from "$middlewares/admin.middleware";

const paramIdSchemaValidator = zValidator(
  "param",
  z.object({
    id: z.coerce.number(),
  })
);

export const productApiController = new Hono()
  .use(tokenMiddleware)
  .use(jwt({ secret: env.JWT_SECRET, cookie: "jwtPayload" }))
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

      const productApiRepository = new ProductRepository();

      const showProductsUseCase = new ShowProductsUseCase(productApiRepository);

      if (Object.keys(filters).length) {
        [products] = await showProductsUseCase.execute(filters);
      } else {
        products = await showProductsUseCase.execute();
      }

      return ctx.json(products.map((product) => product.transformToDTO()));
    }
  )
  .post(
    adminMiddleware,
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
        new ProductRepository()
      );

      const product = await createProductUseCase.execute(body);

      return ctx.json(product.transformToDTO());
    }
  )
  .get(
    "/paginate",
    zValidator(
      "query",
      z.object({
        productName: z.string().optional(),
        category: z.string().optional(),
        page: z.coerce.number().default(env.DEFAULT_PAGE),
        limit: z.coerce
          .number()
          .optional()
          .transform((val) =>
            val && env.DEFAULT_LIMITS.includes(val)
              ? val
              : env.DEFAULT_LIMITS[0]
          ),
      })
    ),
    async (ctx) => {
      const queries = ctx.req.valid("query");

      const productApiRepository = new ProductRepository();

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
      const productApiRepository = new ProductRepository();
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
      const productApiRepository = new ProductRepository();
      const getProductByIdUseCase = new GetProductByIdUseCase(
        productApiRepository
      );

      const product = await getProductByIdUseCase.execute(new IdObject(id));

      if (!product) {
        return ctx.json(null);
      }

      return ctx.json(product.transformToDTO());
    }
  )
  .patch(
    adminMiddleware,
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
        new ProductRepository()
      );

      const product = await updateProductUseCase.execute(
        new IdObject(id),
        body
      );

      return ctx.json(product.transformToDTO());
    }
  )
  .delete(adminMiddleware, paramIdSchemaValidator, async (ctx) => {
    const { id } = ctx.req.valid("param");

    const productApiRepository = new ProductRepository();
    const removeProductUseCase = new RemoveProductUseCase(productApiRepository);
    const deletedProduct = await removeProductUseCase.execute(new IdObject(id));

    return ctx.json(deletedProduct.transformToDTO());
  });
