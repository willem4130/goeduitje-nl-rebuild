import { createTRPCRouter } from "./trpc";
import { userRouter } from "./routers/user";
import { workshopRouter } from "./routers/workshop";
import { reviewsRouter } from "./routers/reviews";
import { recipesRouter } from "./routers/recipes";
import { feedbackRouter } from "./routers/feedback";
import { settingsRouter } from "./routers/settings";
import { faqRouter } from "./routers/faq";
import { teamRouter } from "./routers/team";
import { testimonialsRouter } from "./routers/testimonials";
import { contentRouter } from "./routers/content";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workshop: workshopRouter,
  reviews: reviewsRouter,
  recipes: recipesRouter,
  feedback: feedbackRouter,
  settings: settingsRouter,
  faq: faqRouter,
  team: teamRouter,
  testimonials: testimonialsRouter,
  content: contentRouter,
});

export type AppRouter = typeof appRouter;
