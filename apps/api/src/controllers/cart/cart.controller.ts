import { type AppContext, config } from "$/config";
import { CartDTO } from "@eshop/business/domain/dtos";
import { Context, Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const KV_EXPIRATION_TTL = 60 * 60 * 24; // 24 hours

const cartItemProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  image: z.string(),
  price: z.number(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
  inventoryStatus: z.string(),
});

const cartSchema = z.object({
  items: z.array(
    z.object({
      product: cartItemProductSchema,
      quantity: z.number().optional(),
    })
  ),
  totalQuantity: z.number().optional(),
});

type ResolvedCartKey = {
  key: string;
  isSignedIn: boolean;
  anonymousKey: string | null;
};

async function resolveCartKey(c: Context<AppContext>, setCookieFn?: (uuid: string) => void): Promise<ResolvedCartKey> {
  const anonymousCookieValue = getCookie(c, "cart_key") ?? null;

  const authHeader = c.req.header("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const payload = await verify(token, config.jwtSecret, "ES256");
      if (payload && typeof payload === "object" && "user" in payload) {
        const user = payload.user as { id: number };
        return {
          key: `cart_${user.id}`,
          isSignedIn: true,
          anonymousKey: anonymousCookieValue ? `cart_${anonymousCookieValue}` : null,
        };
      }
    } catch {
      // Token invalid, fall through to anonymous
    }
  }

  // Anonymous: use cookie-based UUID key
  if (anonymousCookieValue) {
    return { key: `cart_${anonymousCookieValue}`, isSignedIn: false, anonymousKey: null };
  }

  const uuid = crypto.randomUUID();
  setCookieFn?.(uuid);
  return { key: `cart_${uuid}`, isSignedIn: false, anonymousKey: null };
}

function mergeCarts(userCart: CartDTO, anonCart: CartDTO): CartDTO {
  const merged = { items: [...userCart.items], totalQuantity: userCart.totalQuantity ?? 0 };

  for (const anonItem of anonCart.items) {
    const existing = merged.items.find((i) => i.product.id === anonItem.product.id);
    if (existing) {
      existing.quantity = (existing.quantity ?? 1) + (anonItem.quantity ?? 1);
    } else {
      merged.items.push(anonItem);
    }
  }

  merged.totalQuantity = merged.items.reduce((sum, i) => sum + (i.quantity ?? 1), 0);
  return merged;
}

const setCartKeyCookie = (c: Context<AppContext>) => (uuid: string) => {
  setCookie(c, "cart_key", uuid, {
    httpOnly: true,
    sameSite: "Lax",
    maxAge: KV_EXPIRATION_TTL,
    path: "/",
  });
};

export const cartApiController = new Hono<AppContext>()
  .get("/", async (c) => {
    const { key, isSignedIn, anonymousKey } = await resolveCartKey(c, setCartKeyCookie(c));

    let cart: CartDTO = { items: [], totalQuantity: 0 };

    const data = await c.env.KV_CART.get(key, "text");
    if (data) {
      cart = JSON.parse(data) as CartDTO;
    }

    // Merge anonymous cart into signed-in user's cart
    if (isSignedIn && anonymousKey) {
      const anonData = await c.env.KV_CART.get(anonymousKey, "text");
      if (anonData) {
        const anonCart = JSON.parse(anonData) as CartDTO;
        if (anonCart.items.length > 0) {
          cart = mergeCarts(cart, anonCart);
          await c.env.KV_CART.put(key, JSON.stringify(cart), {
            expirationTtl: KV_EXPIRATION_TTL,
          });
        }
        await c.env.KV_CART.delete(anonymousKey);
      }
      deleteCookie(c, "cart_key", { path: "/" });
    }

    return c.json(cart, 200);
  })
  .put("/", zValidator("json", cartSchema), async (c) => {
    const cart = c.req.valid("json");
    const { key } = await resolveCartKey(c, setCartKeyCookie(c));

    await c.env.KV_CART.put(key, JSON.stringify(cart), {
      expirationTtl: KV_EXPIRATION_TTL,
    });

    return c.json(cart, 200);
  })
  .delete("/", async (c) => {
    const { key } = await resolveCartKey(c);

    await c.env.KV_CART.delete(key);

    return c.json({ items: [], totalQuantity: 0 } satisfies CartDTO, 200);
  });
