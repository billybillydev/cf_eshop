
import { Hono } from "hono";
import { cors } from "hono/cors";
import { config, type AppContext } from "$/config";
import { apiController } from "./controllers";

const app = new Hono<AppContext>()
  .use(
    cors({
      origin: config.allowedHost,
    })
  )
  .use("*", (c, next) => {
    if (c.req.path.startsWith("/api")) {
      return next();
    }
    // SPA redirect to /index.html
    const requestUrl = new URL(c.req.raw.url);
    return c.env.ASSETS.fetch(new URL("/index.html", requestUrl.origin));
  })
  .get("/", (c) => {
    return c.redirect("/api");
  })
  .route("/api", apiController);

const port = config.port;

console.log(`Server is running on port ${port}`);

export default {
  fetch: app.fetch,
  port,
};
