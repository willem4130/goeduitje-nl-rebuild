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
import { mediaRouter } from "./routers/media";
import { bookingRouter } from "./routers/booking";

export const appRouter = createTRPCRouter({
  user: userRouter,
  workshop: workshopRouter,
  booking: bookingRouter,
  reviews: reviewsRouter,
  recipes: recipesRouter,
  feedback: feedbackRouter,
  settings: settingsRouter,
  faq: faqRouter,
  team: teamRouter,
  testimonials: testimonialsRouter,
  content: contentRouter,
  media: mediaRouter,
});

export type AppRouter = typeof appRouter;
