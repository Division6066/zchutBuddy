# Complete Guide: Setting Up Sign-Up and Sign-In with Convex Auth and Account Types

## Overview

This Next.js app uses Convex Auth (`@convex-dev/auth`) for authentication with multiple account types. The system supports:

- Guest accounts (localStorage-based, no backend)
- Authenticated accounts (email magic-link or Google OAuth)
- Subscription tiers (Free Trial, Plus, Pro, Max)

---

## Architecture Overview

### Authentication Flow

```
User → Sign-In/Sign-Up → Convex Auth → User Created → Auto-Initialize → Dashboard
```

1. User enters email or clicks Google
2. Magic link sent (email) or OAuth redirect (Google)
3. Convex Auth creates/updates user
4. Callback triggers user initialization
5. User redirected to dashboard

### Key Components

- Server-side: `ConvexAuthNextjsServerProvider` (cookie-based auth)
- Client-side: `ConvexAuthNextjsProvider` (React hooks)
- Middleware: Protects routes and handles redirects
- Callbacks: Auto-initialize new users with subscriptions

---

## Account Types

### 1. Guest Account (No Authentication)

**Type**: Local-only, no backend

**How it works**:
- Stored in `localStorage` only
- No Convex user record
- Limited features (no persistence, no subscriptions)
- Can upgrade to authenticated account anytime

**Implementation**:
```typescript
// lib/guest-auth.tsx
- Uses localStorage
- Generates guest ID: `guest_${timestamp}_${random}`
- No database interaction
```

**Limitations**:
- No saved data persistence
- No subscription features
- No usage tracking
- No alerts or notifications

---

### 2. Free Trial Account

**Type**: Authenticated, 14-day trial

**Pricing**: ₪0/month (14 days)

**Features**:
- 5 chats per day
- 0 deep research per month
- 3 checklists max
- 5 saved rights max
- Basic models only (Tier 5: Gemma)
- ₪10 API budget
- No alerts, PDF export, or priority support

**Auto-initialization**:
When a new user signs up, the system automatically:
1. Creates user record in `users` table
2. Creates `free_trial` subscription (14 days)
3. Initializes usage tracking with tier limits
4. Creates empty user profile
5. Sends welcome alert

---

### 3. Plus Account

**Type**: Authenticated, paid subscription

**Pricing**: ₪49/month

**Features**:
- 50 chats per day
- 5 deep research per month
- 10 checklists max
- 25 saved rights max
- Models up to Tier 4 (Mistral Small)
- ₪19.6 API budget (40% of price)
- Alerts enabled
- PDF export enabled
- Standard support

---

### 4. Pro Account

**Type**: Authenticated, paid subscription

**Pricing**: ₪99/month

**Features**:
- Unlimited chats per day
- 20 deep research per month
- Unlimited checklists
- 100 saved rights max
- Models up to Tier 2 (DeepSeek)
- ₪39.6 API budget
- All Plus features
- Priority support

---

### 5. Max Account

**Type**: Authenticated, premium subscription

**Pricing**: ₪199/month

**Features**:
- Unlimited everything (chats, research, checklists, saved rights)
- All models including Tier 1 (KimiK2)
- ₪79.6 API budget
- All Pro features
- API access

---

## Sign-Up Flow

### Step-by-Step Process

1. User visits `/sign-up`
2. User enters email OR clicks "Continue with Google"
3. Magic link sent (email) OR OAuth redirect (Google)
4. User clicks link → redirected to `/?code=...`
5. Middleware exchanges code → sets auth cookies
6. Convex Auth creates user → triggers `afterUserCreatedOrUpdated` callback
7. Callback calls `initializeNewUserInternal`:
   - Creates `free_trial` subscription
   - Initializes usage tracking
   - Creates user profile
   - Creates welcome alert
8. User redirected to `/onboarding`

### Code Flow

```typescript
// app/(auth)/sign-up/page.tsx
User enters email → signIn("resend", { email, redirectTo: "/onboarding" })
↓
// Email sent with magic link
User clicks link → Redirected to /?code=...
↓
// middleware.ts
convexAuthNextjsMiddleware exchanges code → Sets cookies
↓
// convex/auth.ts - afterUserCreatedOrUpdated callback
if (existingUserId === null) {
  await ctx.runMutation(internal.users.initializeNewUserInternal, { userId });
}
↓
// convex/users.ts - initializeNewUserInternal
Creates subscription, usage tracking, profile, alert
↓
User redirected to /onboarding
```

### Sign-Up UI Components

**File**: `app/(auth)/sign-up/page.tsx`

Key features:
- Email input form
- "Check your email" confirmation screen
- Google OAuth button
- Guest login option
- Terms & Privacy links

---

## Sign-In Flow

### Step-by-Step Process

1. User visits `/sign-in`
2. User enters email OR clicks "Continue with Google"
3. Magic link sent OR OAuth redirect
4. User clicks link → redirected to `/?code=...`
5. Middleware exchanges code → sets auth cookies
6. Convex Auth finds existing user → triggers `afterUserCreatedOrUpdated` callback
7. Callback checks `existingUserId` → skips initialization (user already exists)
8. User redirected to `/dashboard`

### Code Flow

```typescript
// app/(auth)/sign-in/page.tsx
User enters email → signIn("resend", { email, redirectTo: "/dashboard" })
↓
// Email sent with magic link
User clicks link → Redirected to /?code=...
↓
// middleware.ts
convexAuthNextjsMiddleware exchanges code → Sets cookies
↓
// convex/auth.ts - afterUserCreatedOrUpdated callback
if (existingUserId === null) {
  // Skip - user already exists
} else {
  console.log(`Existing user signed in: ${userId}`);
}
↓
User redirected to /dashboard
```

### Sign-In UI Components

**File**: `app/(auth)/sign-in/page.tsx`

Key features:
- Email input form
- "Check your email" confirmation screen
- Google OAuth button
- Guest login option
- Link to sign-up page

---

## Configuration Setup

### Required Environment Variables

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key

# Convex Auth
AUTH_SECRET=your-random-secret-key-32-chars-min
SITE_URL=http://localhost:3000  # or https://yourdomain.com

# Google OAuth (optional)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Resend Email (for magic links)
AUTH_RESEND_KEY=re_your-resend-api-key
AUTH_EMAIL_FROM=noreply@yourdomain.com
```

### File Structure

```
app/
├── layout.tsx                    # Root layout with ConvexAuthNextjsServerProvider
├── (auth)/
│   ├── sign-in/page.tsx         # Sign-in UI
│   └── sign-up/page.tsx         # Sign-up UI
components/
└── providers/
    └── providers.tsx             # ConvexAuthNextjsProvider wrapper
convex/
├── auth.ts                       # Convex Auth configuration
├── users.ts                      # User initialization logic
└── schema.ts                     # Database schema
middleware.ts                     # Route protection & redirects
```

---

## Key Implementation Details

### 1. Server-Side Auth Provider

```typescript
// app/layout.tsx
<ConvexAuthNextjsServerProvider>
  <Providers>{children}</Providers>
</ConvexAuthNextjsServerProvider>
```

Purpose: Enables cookie-based authentication for Next.js middleware

---

### 2. Client-Side Auth Provider

```typescript
// components/providers/providers.tsx
<ConvexAuthNextjsProvider client={convex}>
  <I18nProvider>
    <GuestAuthProvider>{children}</GuestAuthProvider>
  </I18nProvider>
</ConvexAuthNextjsProvider>
```

Purpose: Provides React hooks (`useAuthActions`, `useConvexAuth`) for client components

---

### 3. Auth Configuration

```typescript
// convex/auth.ts
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Google({ clientId, clientSecret }),
    createResendProvider(), // Email magic links
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
      if (existingUserId === null) {
        // New user - initialize subscription/profile
        await ctx.runMutation(internal.users.initializeNewUserInternal, { userId });
      }
    },
  },
});
```

Key points:
- Supports Google OAuth and email magic links
- `afterUserCreatedOrUpdated` callback triggers on user creation/update
- Only initializes new users (`existingUserId === null`)

---

### 4. User Initialization

```typescript
// convex/users.ts - initializeNewUserInternal
export const initializeNewUserInternal = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Check if already initialized (idempotent)
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (existingSubscription) {
      return { status: "already_initialized" };
    }

    // Create free trial subscription
    await ctx.db.insert("subscriptions", {
      userId,
      tier: "free_trial",
      status: "trialing",
      trialStartedAt: now,
      trialEndsAt: now + 14 * 24 * 60 * 60 * 1000,
      // ...
    });

    // Initialize usage tracking
    await ctx.db.insert("usageTracking", {
      userId,
      apiCreditsUsed: 0,
      apiCreditsLimit: 10, // Free trial budget
      // ...
    });

    // Create user profile
    await ctx.db.insert("userProfiles", {
      userId,
      isAnonymous: false,
      // ...
    });

    // Create welcome alert
    await ctx.db.insert("alerts", {
      userId,
      type: "system",
      title: "ברוכים הבאים לזכויות באדי!",
      // ...
    });
  },
});
```

What it creates:
- Subscription record (`free_trial`, 14 days)
- Usage tracking (with tier limits)
- User profile (empty, ready for onboarding)
- Welcome alert

---

### 5. Route Protection

```typescript
// middleware.ts
export default convexAuthNextjsMiddleware(async (request) => {
  // Redirect authenticated users away from auth pages
  if (isAuthRoute(request) && (await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/dashboard");
  }

  // Redirect unauthenticated users away from protected pages
  if (isProtectedRoute(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }
});
```

Protected routes:
- `/dashboard(.*)`
- `/onboarding(.*)`
- `/settings(.*)`

Auth routes (redirect if authenticated):
- `/sign-in(.*)`
- `/sign-up(.*)`

---

## Authentication Methods

### 1. Email Magic Link (Resend)

**How it works**:
1. User enters email
2. `signIn("resend", { email, redirectTo })` called
3. Resend API sends email with magic link
4. Link contains `?code=...` parameter
5. User clicks link → redirected to `/?code=...`
6. Middleware exchanges code → sets cookies
7. User authenticated

**Email template**:
- Hebrew RTL support
- Click button or copy link
- Valid for 24 hours

---

### 2. Google OAuth

**How it works**:
1. User clicks "Continue with Google"
2. `signIn("google", { redirectTo })` called
3. Redirected to Google OAuth consent screen
4. User approves → redirected back with code
5. Convex Auth exchanges code → creates/updates user
6. User authenticated

**Requirements**:
- Google OAuth credentials (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`)
- OAuth redirect URI configured in Google Console

---

### 3. Guest Login

**How it works**:
1. User clicks "המשך כאורח" (Continue as Guest)
2. `loginAsGuest()` called
3. Guest ID generated: `guest_${timestamp}_${random}`
4. Stored in `localStorage` only
5. No backend interaction
6. User can use app with limitations

---

## Database Schema

### Users Table

```typescript
users: {
  // Convex Auth fields
  email: string (optional)
  emailVerificationTime: number (optional)
  image: string (optional)
  name: string (optional)
  
  // App-specific fields
  language: "he" | "en"
  createdAt: number
  lastLoginAt: number
  onboardingCompleted: boolean
}
```

### Subscriptions Table

```typescript
subscriptions: {
  userId: Id<"users">
  tier: "free_trial" | "plus" | "pro" | "max"
  status: "active" | "canceled" | "past_due" | "trialing"
  trialStartedAt: number (optional)
  trialEndsAt: number (optional)
  priceInShekels: number
  createdAt: number
  updatedAt: number
}
```

### Usage Tracking Table

```typescript
usageTracking: {
  userId: Id<"users">
  periodStart: number
  periodEnd: number
  apiCreditsUsed: number
  apiCreditsLimit: number
  crawlCreditsUsed: number
  crawlCreditsLimit: number
  totalTokensUsed: number
  softCapReached: boolean
  hardCapReached: boolean
}
```

---

## Testing the Setup

### Test Sign-Up Flow

1. Go to `http://localhost:3000/sign-up`
2. Enter email address
3. Click "שלח קישור הרשמה"
4. Check email inbox
5. Click magic link
6. Verify redirect to `/onboarding`
7. Check Convex Dashboard → Data tables:
   - `users` - new user created
   - `subscriptions` - `free_trial` subscription
   - `usageTracking` - initialized with limits
   - `userProfiles` - empty profile created
   - `alerts` - welcome message

### Test Sign-In Flow

1. Go to `http://localhost:3000/sign-in`
2. Enter same email
3. Click "שלח קישור התחברות"
4. Check email inbox
5. Click magic link
6. Verify redirect to `/dashboard`
7. Verify no duplicate initialization (check logs)

### Test Google OAuth

1. Go to `/sign-up` or `/sign-in`
2. Click "Google" button
3. Complete Google OAuth flow
4. Verify redirect to correct page
5. Verify user created/updated in Convex

### Test Guest Login

1. Go to `/sign-in` or `/sign-up`
2. Click "המשך כאורח"
3. Verify redirect to `/dashboard`
4. Verify guest ID in localStorage
5. Verify no Convex user record created

---

## Troubleshooting

### Issue: Magic link doesn't authenticate

**Solution**:
- Check `SITE_URL` matches your dev server URL
- Verify `AUTH_SECRET` is set
- Check Resend API key is valid
- Verify email provider allows links

### Issue: User not initialized after sign-up

**Solution**:
- Check `convex/auth.ts` callback is configured
- Verify `initializeNewUserInternal` mutation exists
- Check Convex logs for errors
- Ensure `internal` API is imported correctly

### Issue: Redirect loops

**Solution**:
- Check `middleware.ts` route matchers
- Verify `isAuthenticatedNextjs()` works correctly
- Check for conflicting redirects in components

### Issue: Google OAuth fails

**Solution**:
- Verify OAuth credentials are correct
- Check redirect URI in Google Console matches
- Ensure `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are set

---

## Summary

This setup provides:
- Multiple authentication methods (email, Google, guest)
- Automatic user initialization with subscriptions
- Subscription tier management
- Route protection via middleware
- Cookie-based server-side auth
- React hooks for client-side auth

The system automatically:
- Creates free trial subscriptions for new users
- Initializes usage tracking
- Creates user profiles
- Sends welcome alerts
- Handles redirects based on auth state

All authentication is handled by Convex Auth with custom callbacks for user initialization, ensuring new users are set up with the correct subscription tier and limits.

---

## Related Files

- [`convex/auth.ts`](../convex/auth.ts) - Auth configuration
- [`convex/users.ts`](../convex/users.ts) - User initialization
- [`convex/schema.ts`](../convex/schema.ts) - Database schema
- [`convex/lib/subscriptionConfig.ts`](../convex/lib/subscriptionConfig.ts) - Tier configuration
- [`middleware.ts`](../middleware.ts) - Route protection
- [`app/(auth)/sign-up/page.tsx`](../app/(auth)/sign-up/page.tsx) - Sign-up UI
- [`app/(auth)/sign-in/page.tsx`](../app/(auth)/sign-in/page.tsx) - Sign-in UI
- [`lib/guest-auth.tsx`](../lib/guest-auth.tsx) - Guest authentication
- [`components/providers/providers.tsx`](../components/providers/providers.tsx) - Auth providers

