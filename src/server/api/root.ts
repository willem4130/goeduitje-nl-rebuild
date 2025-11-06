import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { workshopRouter } from "./routers/workshop";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workshop: workshopRouter,
});

export type AppRouter = typeof appRouter;
