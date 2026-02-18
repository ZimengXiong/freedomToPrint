import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getApproved = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("voices")
      .filter((q) => q.eq(q.field("status"), "approved"))
      .order("desc")
      .collect();

    return rows.map((row) => ({
      quote: row.quote,
      author: row.author,
      title: row.title,
    }));
  },
});

export const submitFromServer = internalMutation({
  args: {
    quote: v.string(),
    author: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const quote = args.quote.trim().slice(0, 2000);
    const author = args.author.trim().slice(0, 120);
    const title = args.title.trim().slice(0, 120);

    if (!quote || !author || !title) {
      throw new Error("Invalid submission");
    }

    await ctx.db.insert("voices", {
      quote,
      author,
      title,
      status: "approved",
    });
  },
});
