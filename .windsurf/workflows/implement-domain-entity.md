---
description: Implement a new domain entity with DDD + TDD (entity, DTO, port, in-memory adapter, use cases, tests)
---

All files live under `packages/business/src/` unless stated otherwise.
Use the path aliases `$domain/...` and `$infrastructure/...` in every import.

The prompt must supply:
- **EntityName** — PascalCase (e.g. `Review`)
- **entity-name** — kebab-case (e.g. `review`)
- **DTO fields** — list of fields with their types
- **Port methods** — list of method signatures the repository interface must expose
- **Use cases** — list of use-case names in kebab-case (e.g. `create-review`, `get-review-by-id`)
- **Test scenarios** — per use case, a list of `it(...)` descriptions to implement

---

## Step 1 — Entity class

Create `domain/entities/entity-name/entity-name.entity.ts`:

```ts
import { EntityNameDTO } from "$domain/dtos/entity-name";

export class EntityNameEntity {
  // declare fields using value objects or primitives
  // mirror DTO fields in the constructor

  constructor(dto: EntityNameDTO) {
    // assign fields from dto
  }

  transformToDTO(): EntityNameDTO {
    return {
      // map this.field -> dto field
    };
  }
}
```

---

## Step 2 — DTO

Create `domain/dtos/entity-name/entity-name.dto.ts`:

```ts
export type EntityNameDTO = {
  // fields are filled based on entity type fields
};
```

Create `domain/dtos/entity-name/index.ts`:

```ts
export * from "$domain/dtos/entity-name/entity-name.dto";
```

Append to `domain/dtos/index.ts`:

```ts
export * from "$domain/dtos/entity-name";
```

Create `domain/entities/entity-name/index.ts`:

```ts
export * from "$domain/entities/entity-name/entity-name.entity";
```

Append to `domain/entities/index.ts`:

```ts
export * from "$domain/entities/entity-name";
```

---

## Step 3 — Repository port

Create `infrastructure/ports/entity-name.repository.interface.ts`:

```ts
import { EntityNameEntity } from "$domain/entities";

export interface EntityNameRepositoryInterface {
  // one method per prompt-listed port method, e.g.:
  // create(data: CreateEntityNameDTO): Promise<EntityNameEntity | null>;
  // getById(id: IdObject): Promise<EntityNameEntity | null>;
}
```

Append to `infrastructure/ports/index.ts`:

```ts
export * from "$infrastructure/ports/entity-name.repository.interface";
```

---

## Step 4 — In-memory adapter

Create `infrastructure/adapters/in-memory/in-memory-entity-name.repository.ts`:

```ts
import { EntityNameRepositoryInterface } from "$infrastructure/ports";
import { EntityNameEntity } from "$domain/entities";

export class InMemoryEntityNameRepository implements EntityNameRepositoryInterface {
  private store: EntityNameEntity[] = [];

  // implement each method declared in the port
  // methods must operate on this.store and return Promise<...>
  // implement only what is needed by the use cases being tested — expand as new test files are written
}
```

Append to `infrastructure/adapters/in-memory/index.ts`:

```ts
export * from "$infrastructure/adapters/in-memory/in-memory-entity-name.repository";
```

---

## Step 5 — Use cases

For **each use case** listed in the prompt, create `domain/usecases/entity-name/usecase-name.usecase.ts`:

```ts
import { EntityNameRepositoryInterface } from "$infrastructure/ports/entity-name.repository.interface";

export class UseCaseNameUseCase {
  constructor(
    private readonly entityNameRepository: EntityNameRepositoryInterface
  ) {}

  async execute(/* params derived from the use case purpose */): Promise</* return type */> {
    return this.entityNameRepository.methodName(/* params */);
  }
}
```

Execute params are based-on DTO fields. If necessary, create derived DTO types (eg: `CreateEntityNameDTO` -> `CreateEntityNameCommand`).

Create `domain/usecases/entity-name/index.ts` exporting all use cases:

```ts
export * from "$domain/usecases/entity-name/usecase-name.usecase";
// one line per use case
```

---

## Step 6 — Use case tests (TDD)

For **each use case**, create `tests/units/usercases/entity-name/usecase-name.usecase.test.ts`.

Rules:
- Always import test functions from `@jest/globals`: `import { beforeEach, describe, expect, it } from "@jest/globals";`
- Instantiate `InMemoryEntityNameRepository` in `beforeEach`
- Each `it(...)` description must match the scenario listed in the prompt
- Implement in-memory repository methods **on the fly** as each test demands them — do not pre-implement unused methods
- Use `expect(...).resolves` / `expect(...).rejects.toThrow(...)` as appropriate
- Keep test data as small factory functions (e.g. `function makeEntityName(): EntityNameEntity { ... }`)

Template:

```ts
import { EntityNameEntity } from "$domain/entities";
import { UseCaseNameUseCase } from "$domain/usecases/entity-name";
import { InMemoryEntityNameRepository } from "$infrastructure/adapters/in-memory";
import { beforeEach, describe, expect, it } from "@jest/globals";

let repository: InMemoryEntityNameRepository;

beforeEach(() => {
  repository = new InMemoryEntityNameRepository();
});

describe("UseCaseNameUseCase", () => {
  it("scenario description from prompt", async () => {
    const useCase = new UseCaseNameUseCase(repository);
    // arrange → act → assert
  });
});
```

---

## Adding a new use case to an existing entity

When the prompt asks for a new use case on an **existing entity**:

1. Read the existing entity class, DTO and port interface
2. Add the new method signature to the existing port interface
3. Add the method implementation to the in-memory adapter (only what the new test needs)
4. Create the use case file and append its export to the entity's `usecases/index.ts`
5. Create the test file following Step 6 above
