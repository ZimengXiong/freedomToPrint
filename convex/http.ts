import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { rateLimiter } from "./rateLimits";

const http = httpRouter();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

http.route({
  path: "/submit-voice",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }),
});

http.route({
  path: "/submit-voice",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    let body: { quote?: string; author?: string; title?: string };
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "Invalid JSON payload." },
        { status: 400, headers: CORS_HEADERS },
      );
    }

    const ip = getClientIp(request);
    const status = await rateLimiter.limit(ctx, "submitVoiceByIp", { key: ip });
    if (!status.ok) {
      return Response.json(
        { error: "Rate limit exceeded. Maximum 20 submissions per day per IP.", retryAfter: status.retryAfter },
        { status: 429, headers: CORS_HEADERS },
      );
    }

    try {
      await ctx.runMutation(internal.voices.submitFromServer, {
        quote: body.quote ?? "",
        author: body.author ?? "",
        title: body.title ?? "",
      });
      return Response.json({ ok: true }, { headers: CORS_HEADERS });
    } catch {
      return Response.json(
        { error: "Invalid submission." },
        { status: 400, headers: CORS_HEADERS },
      );
    }
  }),
});

export default http;
