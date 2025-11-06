import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import { createCallerFactory } from "@/server/api/trpc";

const createContext = cache(async () => {
  const heads = await headers();
  return createTRPCContext({
    headers: heads,
  });
});

const createCaller = createCallerFactory(appRouter);

export const api = createCaller(createContext);
