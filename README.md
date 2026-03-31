# cf_eshop

A minimal e-commerce web application demonstrating modern full-stack development on the edge.

## Tech Stack

- **API** — [Hono](https://hono.dev) (lightweight, edge-first web framework)
- **Frontend** — [React](https://react.dev) (primary), with SvelteKit and Next.js apps scaffolded for future use
- **Monorepo** — [Bun](https://bun.sh) workspaces
- **Edge Services** — [Cloudflare](https://developers.cloudflare.com) (Workers, D1, KV, Assets)
- **CI/CD** — GitHub Actions

## Architecture

The project follows **Hexagonal Architecture**, **TDD** and **DDD** principles:

```
packages/
  business/    # Domain layer — entities, value objects, use cases, port interfaces
  application/ # Application layer — shared utilities (FetchApi, etc.)
  css/         # Shared design tokens and themes
apps/
  api/         # Hono API deployed as a Cloudflare Worker
  react/       # React SPA (Vite + TailwindCSS)
  sveltekit/   # SvelteKit app (planned)
  next/        # Next.js app (planned)
```

The **business** package is framework-agnostic: entities, use cases and repository interfaces live here with no dependency on any runtime or framework. Each app implements its own repository adapters against these ports.

## Features

### API (`apps/api`)

- **Products** — list (with pagination and filtering by category/name), get by ID, get by code
- **Categories** — list all, get by ID
- **Authentication** — account creation, JWT login/logout, cookie-based token management
- **Admin** — create, update and delete products (restricted to admin users via middleware)
- **Cart** — GET/PUT/DELETE backed by Cloudflare KV (`KV_CART`) with 24h TTL; supports both authenticated and anonymous users, with automatic cart merge on sign-in
- **Checkout** — multi-step checkout flow (buyer info, delivery, payment)

### Frontend (`apps/react`)

- **Product catalog** — browsable product list with category filtering, name search and pagination
- **Product detail** — dedicated page per product (by code)
- **Cart** — add/remove/update quantity, cart badge in header, empty cart state, loading state
- **Checkout** — multi-step checkout page
- **Contact** — contact form with validation
- **Authentication** — login, register, JWT persistence in localStorage
- **User menu** — popover in header for signed-in users (profile, orders, favorites links)

### Business Domain (`packages/business`)

- **Entities** — `CartEntity`, `CartItemEntity`, `CartItemProductEntity`, `ProductEntity`, `ProductItemEntity`, `CategoryEntity`, `CustomerEntity`, `EmailInfoEntity`, `OrderEntity`
- **Use Cases** — cart (add, delete, update quantity, get), product (show, get by id/code, create, update, remove), category (get all, get by id), customer (create, get by email, is admin), email, order
- **Unit Tests** — comprehensive test suite covering use cases for cart, product, category, customer, email and order domains

### CI/CD

- **Business CI** — GitHub Action running unit tests on push/PR for `packages/business`

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- [Node.js](https://nodejs.org) (v20+ for CI compatibility)

### Install

```bash
bun install
```

### Development

```bash
# Start all apps
bun run dev

# Or individually
bun run dev:api    # Hono API on port 4000
bun run dev:react  # React app (Vite)
```

### Database

```bash
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run migrations
bun run db:seed      # Seed data
```

### Testing

```bash
bun run test            # Run all tests
bun run test:business   # Run business domain tests only
bun run test:react      # Run React tests only
```

### Build

```bash
bun run build
```

## License

Private