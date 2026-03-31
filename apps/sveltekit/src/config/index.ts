import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv";
import { z } from "zod";

config();

export const env = createEnv({
  server: {
    HOST_URL: z.string().default("http://localhost"),
    NODE_ENV: z.enum(["development", "production", "test"]),
    PORT: z.coerce.number().default(3000),
    API_URL: z.string(),
  },
  runtimeEnv: process.env,
});
