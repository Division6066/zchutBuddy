# Vercel Deployment Guide - ZchuyotBuddy

Complete step-by-step guide to deploy your Next.js application to Vercel with Convex backend and OpenRouter AI integration.

---

## Prerequisites

✅ GitHub account with your code pushed  
✅ Vercel account (sign up at https://vercel.com)  
✅ Convex account with active deployment  
✅ OpenRouter API key configured  
✅ Clerk authentication keys ready  

---

## Step 1: Connect GitHub Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for your repository (`zchutBuddy` or similar)
5. Select it and click **"Import"**

---

## Step 2: Configure Environment Variables

1. After importing, you'll see the **"Configure Project"** screen
2. Click **"Environment Variables"** section
3. Add the following variables:

### Required Production Variables

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Your Convex deployment URL | `https://pastel-narwhal-965.convex.cloud` |
| `OPENROUTER_API_KEY` | Your OpenRouter API key | `sk-or-v1-e8b4725f904...` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_Y29tcGxldGUt...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_3G16VkEYxMU2...` |
| `SITE_URL` | Leave empty for now, update after first deploy | Later: `https://your-app.vercel.app` |

### How to Find Your Values

**NEXT_PUBLIC_CONVEX_URL:**
- Go to https://dashboard.convex.dev
- Select your project
- Go to **Settings** → Copy the **Deployment URL**

**OPENROUTER_API_KEY:**
- Go to https://openrouter.ai/keys
- Copy your API key

**CLERK Keys:**
- Go to https://dashboard.clerk.com
- Select your application
- Go to **API Keys** section
- Copy both keys

---

## Step 3: Build Settings

1. In Vercel project settings, ensure:
   - **Framework Preset:** Next.js ✓ (should auto-detect)
   - **Build Command:** Leave as default
   - **Install Command:** Leave as default
   - **Output Directory:** `.next` (should auto-detect)

2. The `vercel.json` file in your project root will handle Bun configuration

---

## Step 4: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (typically 1-3 minutes)
3. Once successful, you'll see your live URL

---

## Step 5: Update Environment Variables After First Deploy

Once deployed, you'll have your Vercel URL. Update:

1. Go back to **Project Settings** → **Environment Variables**
2. Edit `SITE_URL` and set it to your Vercel URL:
   - Example: `https://zchuyotbuddy.vercel.app`
3. Edit `APP_PUBLIC_URL` to the same URL
4. Click **"Save"** and **"Redeploy"** from the deployments page

---

## Step 6: Set Convex Environment Variables

Your Convex backend needs email and OAuth configuration:

1. Go to https://dashboard.convex.dev
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables (if you're using email/OAuth):

**For Email Magic Links (optional):**
- `AUTH_RESEND_KEY` = Your Resend API key
- `AUTH_EMAIL_FROM` = Email address verified in Resend

**For Google OAuth (optional):**
- `AUTH_GOOGLE_ID` = Your Google OAuth client ID
- `AUTH_GOOGLE_SECRET` = Your Google OAuth secret

---

## Troubleshooting

### Build Fails with "duplicate routes"

✅ **FIXED** - We already renamed the conflicting pages to:
- `/stitch-app-preview` (was `/app` duplicate)
- `/stitch-onboarding-preview` (was `/onboarding` duplicate)

### Build Fails: "NEXT_PUBLIC_CONVEX_URL not set"

1. Go to Vercel Project Settings
2. Verify **Environment Variables** section has `NEXT_PUBLIC_CONVEX_URL`
3. Make sure it's set correctly to your Convex URL
4. Click **Redeploy**

### Build Fails: "OPENROUTER_API_KEY not configured"

1. Verify `OPENROUTER_API_KEY` is set in Vercel
2. Check the key starts with `sk-or-v1-`
3. Verify it's not expired (check at https://openrouter.ai/keys)
4. Redeploy if needed

### Authentication Not Working

1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
2. Go to Clerk Dashboard → **JWT Templates**
3. Ensure "Convex" template is created and applied
4. For OAuth: Update Google OAuth redirect URI in Google Console:
   - Add: `https://your-app.vercel.app/api/auth/callback/google`

### Convex Connection Failed

1. Verify `NEXT_PUBLIC_CONVEX_URL` points to correct deployment
2. Check Convex deployment is active at https://dashboard.convex.dev
3. If needed, redeploy Convex: `bunx convex deploy`

### Email Not Sending

1. Verify `AUTH_RESEND_KEY` is set in Convex Dashboard (not Vercel)
2. Verify `AUTH_EMAIL_FROM` is set and verified in Resend
3. Check Resend dashboard for any errors

---

## Verification Checklist

Use the verification script to confirm everything is set up:

```bash
node scripts/verify-env.js
```

This will check:
- ✅ All required environment variables present
- ✅ Correct variable formats
- ✅ Missing optional configurations

---

## Next Steps

After successful deployment:

1. **Test the app:**
   - Visit your Vercel URL
   - Sign in / Sign up
   - Test chat functionality
   - Verify all pages load

2. **Monitor deployments:**
   - Vercel Dashboard shows real-time logs
   - Check for any errors in deployment

3. **Set up CI/CD:**
   - Enable "Deploy on push" (auto-deploys when you push to main)
   - Set up preview deployments for PRs

4. **Configure custom domain (optional):**
   - Go to **Project Settings** → **Domains**
   - Add your custom domain
   - Update DNS records as instructed

---

## Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Convex Dashboard:** https://dashboard.convex.dev
- **Clerk Dashboard:** https://dashboard.clerk.com
- **OpenRouter:** https://openrouter.ai
- **Resend:** https://resend.com

---

## Quick Reference

### Environment Variables Summary

```env
# Required
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
OPENROUTER_API_KEY=sk-or-v1-...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
SITE_URL=https://your-app.vercel.app

# Optional
APP_PUBLIC_URL=https://your-app.vercel.app
APP_TITLE=ZchuyotBuddy
```

### Build Commands

```bash
# Install dependencies
bun install

# Build for production
bun run build

# Start production server
bun start

# Verify environment
node scripts/verify-env.js
```

---

## Support

If deployment fails:

1. Check build logs in Vercel (Deployments → Build Logs)
2. Run `node scripts/verify-env.js` locally
3. Ensure all environment variables are correct
4. Try **Redeploy** in Vercel Dashboard

---

**Last Updated:** January 2026  
**Status:** Ready for deployment ✅

