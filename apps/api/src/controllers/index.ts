import { authController } from "$controllers/auth/auth.controller";
import { categoryApiController } from "$controllers/category/category.controller";
import { productApiController } from "$controllers/product/product.controller";
import { Hono } from "hono";

export const apiController = new Hono()
  .route("/categories", categoryApiController)
  .route("/products", productApiController)
  .route("/authenticate", authController);
