import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { config as dotenv } from "dotenv";

dotenv();

export const env = createEnv({
  server: {
    HOST_URL: z.string().default("http://localhost"),
    DATABASE_CONNECTION_TYPE: z.enum(["local", "remote", "local-replica"]),
    DATABASE_URL: z.string().optional(),
    DATABASE_AUTH_TOKEN: z
      .string()
      .optional()
      .refine((s) => {
        // not needed for local only
        const type = process.env.DATABASE_CONNECTION_TYPE;
        return type === "remote" || type === "local-replica"
          ? s && s.length > 0
          : true;
      }),
    NODE_ENV: z.enum(["development", "production"]),
    SEEDING_DB: z.enum(["true", "false"]).default("false").transform((s) => s === "true"),
    DEFAULT_LIMITS: z.array(z.coerce.number()).default([8, 16, 32]),
    DEFAULT_PAGE: z.coerce.number().default(1),
    PORT: z.coerce.number(),
    ADMIN_EMAIL: z.string().email().default("admin@eshop.com"),
    JWT_SECRET: z.string(),
  },
  runtimeEnv: process.env,
});

export const config = {
  db: {
    authToken: env.DATABASE_AUTH_TOKEN,
    type: env.DATABASE_CONNECTION_TYPE,
    url: env.DATABASE_CONNECTION_TYPE === "local" ? "file:local.db" : "",
  },
  baseURL: new URL(
    env.NODE_ENV === "production" ? env.HOST_URL : env.HOST_URL + ":" + env.PORT
  ),
  port: env.PORT || 3000,
  adminEmail: env.ADMIN_EMAIL,
  jwtSecret: env.JWT_SECRET,
};