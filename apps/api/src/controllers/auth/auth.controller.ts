import { config } from "$config";
import { UserRepository } from "$infrastructure/repositories/user.repository";
import { UserEntity } from "@eshop/business/domain/entities";
import {
  CreateUserUseCase,
  GetUserByEmailUseCase,
} from "@eshop/business/domain/usecases/user";
import { zValidator } from "@hono/zod-validator";
import { Context, Hono } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";

export const authController = new Hono()
  .post(
    "/token",
    zValidator(
      "json",
      z.object({
        email: z.string({ message: "Email is required" }),
        password: z.string({ message: "Password is required" }),
      })
    ),
    async (ctx) => {
      try {
        const body = ctx.req.valid("json");
        const userRepository = new UserRepository();
        const getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
        const user = await getUserByEmailUseCase.execute(
          body.email,
          body.password
        );

        if (!user) {
          return failedResponse(ctx, "Invalid credentials", 401);
        }

        return generateToken(ctx, user, 200);
      } catch (error) {
        console.log({error})
      }
    }
  )
  .post(
    "/account",
    zValidator(
      "json",
      z.object({
        username: z.string(),
        firstname: z.string(),
        email: z.string(),
        password: z.string(),
      })
    ),
    async (ctx) => {
      try {
        const body = ctx.req.valid("json");
        const userRepository = new UserRepository();
        const createUserUseCase = new CreateUserUseCase(userRepository);
        const user = await createUserUseCase.execute(body);

        if (!user) {
          return failedResponse(ctx, "User already exists", 400);
        }

        return generateToken(ctx, user, 201);
      } catch (error) {
        const err = error as Error;
        console.log(err);
        return failedResponse(ctx,"Internal Server error", 500);
      }
    }
  )
  .delete("/logout", async (ctx) => {
    deleteCookie(ctx, "jwtPayload");
    return ctx.json({ message: "Logout successful" });
  });

async function failedResponse<T extends Context>(
  ctx: T,
  message: string,
  status: ContentfulStatusCode
) {
  return ctx.json({ error: message }, status);
}

async function generateToken<T extends Context>(
  ctx: T,
  user: UserEntity,
  status: ContentfulStatusCode
) {
  const { password, ...sanitizedUser } = user.transformToDTO();
  const token = await sign(
    {
      user: sanitizedUser,
      exp: Math.floor(Date.now() / 1000) + 60 * 2,
    },
    config.jwtSecret
  );

  setCookie(ctx, "jwtPayload", token);

  return ctx.json({ token }, status);
}
