# Cloudflare Types Unrecognized

## Problem

TypeScript cannot recognize Cloudflare-specific types (e.g., `CloudflareBindings`) because the type definitions are not properly generated or referenced.

## Fix

Run the `cf-typegen` script to generate Cloudflare worker types:

```bash
bun run cf-typegen
```

This executes `wrangler types --env-interface CloudflareBindings`, which generates type definitions based on your `wrangler.jsonc` bindings configuration.

Then, ensure your `tsconfig.json` includes the generated type files so TypeScript can resolve the Cloudflare types.

In `apps/api/tsconfig.json`, update the `include` array:

```diff
- "include": ["src"],
+ "include": ["src", "worker-configuration.d.ts", "service-bindings.d.ts"],
```

Finally, in `apps/api/src/config/bindings.ts`, extend `AppBindings` from `CloudflareBindings` so all wrangler-declared bindings (e.g., `ASSETS`) are available in Hono's `c.env`:

```diff
- export type AppBindings = {
-   DB: DrizzleD1Database;
- };
+ export type AppBindings = CloudflareBindings & {
+   DB: DrizzleD1Database;
+ };
```
