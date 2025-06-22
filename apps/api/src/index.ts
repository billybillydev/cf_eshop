import { env } from "$config";
import { apiController } from "$controllers";
import { Hono } from "hono";

const app = new Hono();

app
  .get("/", (c) => {
    return c.text("Hello Hono!");
  })
  .route("/api", apiController);

const port = env.PORT;
console.log(`Server is running on port ${port}`);

export default {
  fetch: app.fetch,
  port,
};
