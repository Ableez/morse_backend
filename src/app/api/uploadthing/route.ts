import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";
import { env } from "#/env";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,

  // Apply an (optional) custom config:
  config: { isDev: !!(env.NODE_ENV === "development") },
});
