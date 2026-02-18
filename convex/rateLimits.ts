import { DAY, RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

export const rateLimiter = new RateLimiter(components.rateLimiter, {
  submitVoiceByIp: { kind: "fixed window", rate: 20, period: DAY },
});
