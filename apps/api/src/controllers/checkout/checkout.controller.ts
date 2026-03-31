import type { AppContext } from "$config";
import { CheckoutValueObject } from "@eshop/business/domain/value-objects";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const stepStatusSchema = z.enum(["passed", "pending", "waiting"]);

const checkoutSchema = z.object({
  step1: stepStatusSchema,
  step2: stepStatusSchema,
  step3: stepStatusSchema,
});

const addressSchema = z.object({
  line1: z.string(),
  line2: z.string(),
  city: z.string(),
  zipCode: z.string(),
  country: z.string(),
});

const buyerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

const step1PayloadSchema = z.object({
  buyer: buyerSchema,
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  billingSameAsShipping: z.boolean().optional(),
});

const step2PayloadSchema = z.object({
  deliveryMethodId: z.string(),
});

const step3PayloadSchema = z.object({
  paymentMethodId: z.string(),
});

export const checkoutApiController = new Hono<AppContext>()
  // .post("", zValidator("json", cartSchema))
  .post("/step1", zValidator("json", step1PayloadSchema), async (ctx) => {
    const { buyer, shippingAddress, billingAddress, billingSameAsShipping } =
      ctx.req.valid("json");
    const checkout = new CheckoutValueObject(1, 0, 0);

    return ctx.json({ checkout }, 200);
  })
  .post("/step2", zValidator("json", step2PayloadSchema), async (ctx) => {
    const checkout = checkoutSchema.parse({
      step1: "passed",
      step2: "pending",
      step3: "waiting",
    });

    return ctx.json({ checkout }, 200);
  })
  .post("/step3", zValidator("json", step3PayloadSchema), async (ctx) => {
    const checkout = checkoutSchema.parse({
      step1: "passed",
      step2: "passed",
      step3: "pending",
    });

    return ctx.json({ checkout }, 200);
  });
