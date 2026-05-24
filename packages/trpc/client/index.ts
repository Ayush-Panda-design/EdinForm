import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";

import type { AppRouter } from "@repo/api";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClientConfig = {
  links: [
    httpBatchLink({
      url: "http://localhost:8000/api/trpc",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
  transformer: superjson,
};