import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
  callbacks: {
    /**
     * Called after a user is created or updated during sign-in.
     * We use this to initialize new users with subscription, usage tracking, etc.
     */
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
      // Only initialize for NEW users (existingUserId is null)
      if (existingUserId === null) {
        console.log(`[auth] New user created: ${userId}, initializing subscription and profile...`);
        await ctx.runMutation(internal.users.initializeNewUserInternal, {
          userId,
        });
      } else {
        console.log(`[auth] Existing user signed in: ${userId}`);
      }
    },
  },
});
