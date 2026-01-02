# Environment Variables Setup

## Required API Keys

Before running the development server, you need to configure the following environment variables in your `.env.local` file:

### Convex Backend Keys

1. **NEXT_PUBLIC_CONVEX_URL**
   - Get this from your Convex Dashboard: https://dashboard.convex.dev/
   - Navigate to your deployment → Settings
   - Format: `https://YOUR-DEPLOYMENT.convex.cloud`

2. **CONVEX_DEPLOYMENT**
   - Get this from your Convex Dashboard: https://dashboard.convex.dev/
   - Format: `dev:YOUR-DEPLOYMENT` (for development) or `prod:YOUR-DEPLOYMENT` (for production)

### Convex Auth Keys

3. **CONVEX_AUTH_PRIVATE_KEY**
   - Generate a private key for JWT signing
   - Run: `openssl genrsa -out convex_auth_private_key.pem 2048`
   - Copy the contents of the PEM file as a single line (replace newlines with `\n`)
   - ⚠️ **NEVER commit this key to version control!**

4. **JWKS** (set in Convex Dashboard environment variables)
   - Generate from the private key
   - This should be set in your Convex deployment dashboard, not in `.env.local`

5. **SITE_URL**
   - Your app's base URL
   - Development: `http://localhost:3000`
   - Production: Your production URL

### Email (Resend) Keys

6. **AUTH_RESEND_KEY**
   - Get this from your Resend Dashboard: https://resend.com/api-keys
   - Create a new API key for sending verification emails
   - Format: `re_...`
   - ⚠️ **NEVER commit this key to version control!**
   - Set in Convex Dashboard: `bunx convex env set AUTH_RESEND_KEY "re_..."`

7. **AUTH_EMAIL_FROM**
   - The email address to send verification emails from
   - Must be verified in your Resend account
   - Format: `"ZchuyotBuddy <noreply@yourdomain.com>"`
   - Set in Convex Dashboard: `bunx convex env set AUTH_EMAIL_FROM "ZchuyotBuddy <noreply@yourdomain.com>"`

### Google OAuth Keys

7. **AUTH_GOOGLE_ID**
   - Get this from Google Cloud Console: https://console.cloud.google.com/
   - Create OAuth 2.0 credentials
   - Format: `YOUR_CLIENT_ID.apps.googleusercontent.com`
   - **Authorized redirect URIs** (add both):
     - `https://pastel-narwhal-965.convex.site/api/auth/callback/google` (Convex deployment)
     - `http://localhost:3000/api/auth/callback/google` (local development)

8. **AUTH_GOOGLE_SECRET**
   - The client secret from Google Cloud Console
   - Format: `GOCSPX-...`
   - ⚠️ **NEVER commit this key to version control!**

## Setup Steps

1. Create a `.env.local` file in your project root
2. Sign up for Convex at https://convex.dev/ and create a deployment
3. Sign up for Resend at https://resend.com/ and verify your domain
4. (Optional) Set up Google OAuth in Google Cloud Console
5. Add your API keys to `.env.local`
6. Set environment variables in Convex Dashboard (Settings → Environment Variables):
   - `AUTH_RESEND_KEY`
   - `AUTH_GOOGLE_ID` (if using Google OAuth)
   - `AUTH_GOOGLE_SECRET` (if using Google OAuth)
7. Run `bunx convex dev` to sync your Convex functions
8. Run `bun dev` to start the development server

## Example .env.local

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment

# Site URL (for OAuth callbacks)
SITE_URL=http://localhost:3000

# Resend (for email OTP)
AUTH_RESEND_KEY=re_xxxxxxxxxxxx

# Google OAuth (optional)
AUTH_GOOGLE_ID=your-google-client-id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-xxxxxxxxxxxxxxxx
```

## Security Notes

- The `.gitignore` file is already configured to exclude `.env*` files
- Never commit real API keys to version control
- Keep your secret keys secure and don't share them publicly
- Use different keys for development and production environments
- Set sensitive keys in Convex Dashboard, not just locally
