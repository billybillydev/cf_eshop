---
description: Implement API controller and D1 repository for a domain entity (triggers after implement-domain-entity)
---

This workflow triggers **after** `/implement-domain-entity` has been completed for the target entity.
All files live under `apps/api/src/` unless stated otherwise.
Use the path aliases `$config/...`, `$controllers/...`, `$db/...`, `$infrastructure/...`, `$middlewares/...` in every import.
Business package imports use `@eshop/business/domain/dtos`, `@eshop/business/domain/entities`, `@eshop/business/domain/usecases/entity-name`, `@eshop/business/domain/value-objects`, and `@eshop/business/infrastructure/ports`.

The prompt must supply:
- **EntityName** — PascalCase (e.g. `Favorite`)
- **entity-name** — kebab-case (e.g. `favorite`)
- **Use cases** — list of use-case names in kebab-case with their HTTP method and route (e.g. `POST / -> add-favorite`)
- **Zod schemas** — per route, the validation target (`json`, `param`, `query`) and shape

---

## Pre-check — Verify business domain entity exists

Before starting, confirm the following files exist in `packages/business/src/`:

- `domain/entities/entity-name/entity-name.entity.ts` — `EntityNameEntity` class
- `domain/dtos/entity-name/` — DTO types (base + any derived like `AddEntityNameDTO`)
- `infrastructure/ports/entity-name.repository.interface.ts` — `EntityNameRepositoryInterface`
- `infrastructure/adapters/in-memory/in-memory-entity-name.repository.ts` — in-memory adapter
- `domain/usecases/entity-name/` — one `.usecase.ts` per use case
- `tests/units/usercases/entity-name/` — one `.test.ts` per use case

If any file is missing, run `/implement-domain-entity` first.

---

## Step 1 — Drizzle schema

Create `db/schemas/entity-name.schema.ts`:

```ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const entityNameSchema = sqliteTable("entity_names", {
  // columns derived from the entity fields
  // use integer().primaryKey({ autoIncrement: true }) for `id`
  // use foreign key references where appropriate, e.g.:
  //   .references(() => otherSchema.id)
});

export type SelectEntityName = typeof entityNameSchema.$inferSelect;
export type InsertEntityName = typeof entityNameSchema.$inferInsert;
```

If the schema needs relations (foreign keys), define them:

```ts
import { relations } from "drizzle-orm";

export const entityNameRelations = relations(entityNameSchema, ({ one }) => ({
  relatedEntity: one(relatedSchema, {
    fields: [entityNameSchema.foreignKeyColumn],
    references: [relatedSchema.id],
  }),
}));
```

Append to `db/schemas/index.ts`:

```ts
export * from "$db/schemas/entity-name.schema";
```

---

## Step 2 — D1 repository adapter

Create `infrastructure/repositories/entity-name.repository.ts`:

```ts
import { AppBindings } from "$config/bindings";
import { D1DBRepository } from "$infrastructure/repositories/d1-db.repository";
import { EntityNameRepositoryInterface } from "@eshop/business/infrastructure/ports";
// import entity, DTOs, value objects as needed

export class EntityNameRepository
  extends D1DBRepository
  implements EntityNameRepositoryInterface
{
  constructor(bindingName: AppBindings["DB"]) {
    super(bindingName);
  }

  // Implement each method declared in EntityNameRepositoryInterface.
  // Use this.db (drizzle instance) to query the D1 database.
  // Pattern for queries:
  //   this.db.query.entityNameSchema.findMany(...)
  //   this.db.insert(entityNameSchema).values(...).returning()
  //   this.db.delete(entityNameSchema).where(...)
  // Convert DB rows to domain entities before returning.
}
```

---

## Step 3 — Controller

Create `controllers/entity-name/entity-name.controller.ts`:

```ts
import { AppContext } from "$config";
import { EntityNameRepository } from "$infrastructure/repositories/entity-name.repository";
// import use cases from "@eshop/business/domain/usecases/entity-name"
// import value objects from "@eshop/business/domain/value-objects" if needed
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

export const entityNameApiController = new Hono<AppContext>()
  .httpMethod(
    "/route",
    zValidator(
      "json" | "param" | "query",
      z.object({
        // schema fields from prompt
      })
    ),
    async (ctx) => {
      const validated = ctx.req.valid("json" | "param" | "query");
      const repository = new EntityNameRepository(ctx.env.DB);
      const useCase = new UseCaseNameUseCase(repository);

      const result = await useCase.execute(/* params from validated input */);

      return ctx.json(/* result transformed to DTO or raw */);
    }
  );
  // chain .httpMethod(...) for each use case
```

Rules:
- One chained `.get()`, `.post()`, `.delete()`, `.patch()`, or `.put()` per use case
- Always instantiate `EntityNameRepository` with `ctx.env.DB` inside each handler
- If all http methods use the same `EntityNameRepository` and if stated in prompt, instantiate it in a middleware middlewares/"entity-name-repository".middleware.ts that will be used by all handlers.
- Always validate input with `zValidator` and the appropriate target (`json`, `param`, `query`)
- Use `z.coerce.number()` for numeric path params or query params
- Return `ctx.json(...)` with the entity's `.transformToDTO()` or the raw result
- Wrap handler body in `try/catch` if the use case may throw, returning an error response

---

## Step 4 — Register the controller

In `controllers/index.ts`:

1. Import the new controller:

```ts
import { entityNameApiController } from "$controllers/entity-name/entity-name.controller";
```

2. Add a `.route(...)` call to `apiController`:

```ts
.route("/entity-names", entityNameApiController)
```

---

## Adding a new route to an existing entity controller

When the prompt asks for a new route on an **existing** API entity:

1. Read the existing controller and repository
2. If a new port method is needed, ensure it exists in the business port interface
3. Add the repository method implementation in the D1 adapter
4. Chain a new `.httpMethod(...)` to the existing controller
5. Add `zValidator` schema for the new route
