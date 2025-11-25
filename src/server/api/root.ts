import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { workshopRouter } from "./routers/workshop";
import { reviewsRouter } from "./routers/reviews";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workshop: workshopRouter,
  reviews: reviewsRouter,
});

export type AppRouter = typeof appRouter;
