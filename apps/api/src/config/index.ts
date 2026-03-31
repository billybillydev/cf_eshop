import { AppBindings } from "$config/bindings";
import { AppVariables } from "$config/variables";
import "dotenv/config";

// const envSchema = z.object({
//   NODE_ENV: z.enum(["development", "production"]),
//   SEEDING_DB: z
//     .enum(["true", "false"])
//     .default("false")
//     .transform((s) => s === "true"),
//   DEFAULT_LIMITS: z.array(z.coerce.number()).default([8, 16, 32]),
//   DEFAULT_PAGE: z.coerce.number().default(1),
//   PORT: z.coerce.number(),
//   ADMIN_EMAIL: z.string().email().default("admin@eshop.com"),
//   JWT_SECRET: z.string(),
//   HOST_URL: z.string(),
//   ALLOWED_HOST: z.string(),
//   CLOUDFLARE_ACCOUNT_ID: z.string(),
//   CLOUDFLARE_DATABASE_ID: z.string(),
//   CLOUDFLARE_D1_TOKEN: z.string(),
//   DB: z.string().default("DB"),
// });

// export const env = envSchema.parse(process.env);

export const config = {
  db: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
  port: process.env.PORT!,
  adminEmail: process.env.ADMIN_EMAIL!,
  jwtSecret: process.env.JWT_SECRET!,
  hostURL: process.env.HOST_URL!,
  allowedHost: process.env.ALLOWED_HOST!,
  // defaultLimits: process.env.DEFAULT_LIMITS!,
  defaultLimits: [8, 16, 32],
  // defaultPage: process.env.DEFAULT_PAGE!,
  defaultPage: 1,
};

export type AppContext = {
  Variables: AppVariables;
  Bindings: AppBindings;
};
