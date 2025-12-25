# Environment Variables Setup

## Required API Keys

Before running the development server, you need to configure the following environment variables in both `.env` and `.env.local` files:

### Clerk Authentication Keys

1. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
   - Get this from your Clerk Dashboard: https://dashboard.clerk.com/
   - Navigate to: API Keys → Publishable Key
   - Format: `pk_test_...` (for development) or `pk_live_...` (for production)
   - Replace `pk_test_YOUR_CLERK_PUBLISHABLE_KEY` in both `.env` and `.env.local`

2. **CLERK_SECRET_KEY**
   - Get this from your Clerk Dashboard: https://dashboard.clerk.com/
   - Navigate to: API Keys → Secret Key
   - Format: `sk_test_...` (for development) or `sk_live_...` (for production)
   - Replace `sk_test_YOUR_CLERK_SECRET_KEY` in both `.env` and `.env.local`
   - ⚠️ **NEVER commit this key to version control!**

### Convex Backend Keys

3. **NEXT_PUBLIC_CONVEX_URL**
   - Get this from your Convex Dashboard: https://dashboard.convex.dev/
   - Navigate to your deployment → Settings
   - Format: `https://YOUR-DEPLOYMENT.convex.cloud`
   - Replace `https://YOUR-DEPLOYMENT.convex.cloud` in both `.env` and `.env.local`

4. **CONVEX_DEPLOYMENT**
   - Get this from your Convex Dashboard: https://dashboard.convex.dev/
   - Format: `dev:YOUR-DEPLOYMENT` (for development) or `prod:YOUR-DEPLOYMENT` (for production)
   - Replace `dev:YOUR-DEPLOYMENT` in both `.env` and `.env.local`

## Setup Steps

1. Copy the placeholder values from `.env` or `.env.local`
2. Sign up for Clerk at https://clerk.com/ (if you don't have an account)
3. Sign up for Convex at https://convex.dev/ (if you don't have an account)
4. Get your API keys from both dashboards
5. Replace the placeholder values in `.env` and `.env.local` with your actual keys
6. Save the files
7. Run `bun dev` to start the development server

## Security Notes

- The `.gitignore` file is already configured to exclude `.env*` files
- Never commit real API keys to version control
- Keep your secret keys secure and don't share them publicly
- Use different keys for development and production environments
