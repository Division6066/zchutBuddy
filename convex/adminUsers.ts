import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Simple admin email check - replace with proper RBAC later
const ADMIN_EMAILS = ["levidavidspublic@proton.me"];

export const adminSetSubscriptionByEmail = mutation({
  args: {
    email: v.string(),
    subscriptionTier: v.union(
      v.literal("free_trial"),
      v.literal("plus"),
      v.literal("pro"),
      v.literal("max")
    ),
  },
  handler: async (ctx, { email, subscriptionTier }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Simple admin check by email - replace with proper RBAC later
    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!adminUser || !ADMIN_EMAILS.includes(adminUser.email)) {
      throw new Error("Admin access required");
    }

    const targetUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!targetUser) {
      throw new Error("User not found");
    }

    await ctx.db.patch(targetUser._id, { subscriptionTier });

    return targetUser._id;
  },
});


