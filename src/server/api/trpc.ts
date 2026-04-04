import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { rateLimit } from "@/lib/rate-limit";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const adminMiddleware = t.middleware(({ ctx, next }) => {
  const secret = ctx.headers.get("x-api-secret");
  if (!process.env.API_SECRET || secret !== process.env.API_SECRET) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid API secret" });
  }
  return next();
});

const rateLimitMiddleware = t.middleware(({ ctx, next, path }) => {
  if (process.env.NODE_ENV === "test") return next();
  const ip =
    ctx.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const { success } = rateLimit(`trpc:${path}:${ip}`, 5, 60_000);
  if (!success) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Te veel verzoeken. Probeer het later opnieuw.",
    });
  }
  return next();
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const rateLimitedProcedure = t.procedure.use(rateLimitMiddleware);
export const protectedProcedure = t.procedure.use(adminMiddleware);
