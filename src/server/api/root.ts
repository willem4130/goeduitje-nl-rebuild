import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { workshopRouter } from "./routers/workshop";
import { reviewsRouter } from "./routers/reviews";
import { recipesRouter } from "./routers/recipes";
import { feedbackRouter } from "./routers/feedback";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workshop: workshopRouter,
  reviews: reviewsRouter,
  recipes: recipesRouter,
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;
