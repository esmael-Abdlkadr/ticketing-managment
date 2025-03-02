import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
Sentry.init({
  dsn: "https://eb2a6744ef60664094e67f4dc1a552ef@o4504334846197760.ingest.us.sentry.io/4508805296160768",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

export { Sentry };
