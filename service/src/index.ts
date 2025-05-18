import { serve } from "@hono/node-server";

import { config } from "@/lib/config";
import { app } from "@/app";

serve(
  {
    fetch: app.fetch,
    port: config.PORT,
  },
  (info) => {
    console.log(`✓ Server is running on http://localhost:${info.port}`);
  },
);
