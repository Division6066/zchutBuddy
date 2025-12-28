import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const adminSetSubscriptionByEmail = mutation({
  args: {
    email: v.string(),
    subscriptionTier: v.union(
      v.literal("free_trial"),
      v.literal("plus"),
      v.literal("pro"),
      v.literal("max")
    ),
    subscriptionStatus: v.optional(
      v.union(v.literal("active"), v.literal("expired"), v.literal("cancelled"))
    ),
    trialEndsAt: v.optional(v.number()),
  },
  handler: async (ctx, { email, subscriptionTier, subscriptionStatus, trialEndsAt }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("Admin access required");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!targetUser) {
      throw new Error("User not found");
    }

    const now = Date.now();
    const patch: {
      subscriptionTier: "free_trial" | "plus" | "pro" | "max";
      subscriptionStatus: "active" | "expired" | "cancelled";
      updatedAt: number;
      trialEndsAt?: number;
    } = {
      subscriptionTier,
      subscriptionStatus: subscriptionStatus ?? "active",
      updatedAt: now,
    };

    if (trialEndsAt !== undefined) {
      patch.trialEndsAt = trialEndsAt;
    }

    await ctx.db.patch(targetUser._id, patch);

    return targetUser._id;
  },
});


