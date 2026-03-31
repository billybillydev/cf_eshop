import { adminController } from "$controllers/admin/admin.controller";
import { authController } from "$controllers/auth/auth.controller";
import { cartApiController } from "$controllers/cart/cart.controller";
import { categoryApiController } from "$controllers/category/category.controller";
import { checkoutApiController } from "$controllers/checkout/checkout.controller";
import { productApiController } from "$controllers/product/product.controller";
import { Hono } from "hono";

export const apiController = new Hono()
  .get("/", (ctx) => ctx.text("this is api"))
  .route("/cart", cartApiController)
  .route("/categories", categoryApiController)
  .route("/checkout", checkoutApiController)
  .route("/products", productApiController)
  .route("/authenticate", authController)
  .route("/admin", adminController);
