import type { AppContext } from "$/config";
import { Hono } from "hono";
import { adminController } from "./admin/admin.controller";
import { authController } from "./auth/auth.controller";
import { cartApiController } from "./cart/cart.controller";
import { categoryApiController } from "./category/category.controller";
import { checkoutApiController } from "./checkout/checkout.controller";
import { favoriteApiController } from "./favorite/favorite.controller";
import { productApiController } from "./product/product.controller";

export const apiController = new Hono<AppContext>();

const routes = apiController
  .get("/", (c) => {
    return c.text("This is api !");
  })
  .route("/cart", cartApiController)
  .route("/categories", categoryApiController)
  .route("/checkout", checkoutApiController)
  .route("/favorites", favoriteApiController)
  .route("/products", productApiController)
  .route("/authenticate", authController)
  .route("/admin", adminController);

export type ApiRoutes = typeof routes;
