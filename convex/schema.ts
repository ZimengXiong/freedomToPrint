import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  voices: defineTable({
    quote: v.string(),
    author: v.string(),
    title: v.string(),
    status: v.string(),
  }),
});
