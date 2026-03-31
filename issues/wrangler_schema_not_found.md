# Wrangler Schema Not Found

## Problem

The IDE reports the following error on `wrangler.jsonc`:

```
Unable to load schema from 'node_modules/wrangler/config-schema.json':
Schema not found: file:///Users/billybillydev/cloudflare/cf_eshop/apps/api/node_modules/wrangler/config-schema.json
```

The `$schema` property on line 6 was pointing to a relative path `node_modules/wrangler/config-schema.json`. However, in this monorepo setup, `wrangler` is hoisted to the **root** `node_modules/` directory, not installed locally inside `apps/api/node_modules/`. So the path resolved to a file that doesn't exist.

## Fix

Updated the `$schema` path to traverse up to the root `node_modules`:

```diff
- "$schema": "node_modules/wrangler/config-schema.json",
+ "$schema": "../../node_modules/wrangler/config-schema.json",
```

This correctly resolves to `/Users/billybillydev/cloudflare/cf_eshop/node_modules/wrangler/config-schema.json` where the schema file actually exists.
