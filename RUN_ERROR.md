# Development Server Error

## Error Encountered

When running `bun dev`, `npm run dev`, or `npx next dev`, the following error occurs:

```
Error: Cannot find module 'C:\Users\User\Projects\ZchuyotBuddy-Web-V2\node_modules\next\node_modules\styled-jsx'
Require stack:
  - C:\Users\User\Projects\ZchuyotBuddy-Web-V2\node_modules\next\dist\server\require-hook.js
  - C:\Users\User\Projects\ZchuyotBuddy-Web-V2\node_modules\next\dist\bin\next

code: 'MODULE_NOT_FOUND'
```

## Root Cause

This is a known compatibility issue between:
- Next.js 15.5.4 with Turbopack
- Bun package manager
- The `styled-jsx` dependency resolution

Next.js is looking for `styled-jsx` in its own `node_modules` subdirectory, but it's installed at the root level.

## Attempted Solutions

1. ✅ Installed `styled-jsx` explicitly: `bun add styled-jsx`
2. ✅ Cleared and reinstalled dependencies: `rmdir /s /q .next node_modules && bun install`
3. ✅ Tried with npm: `npm run dev` - same error
4. ✅ Tried without turbopack: `npx next dev` - same error

## Recommended Solutions to Try

### Option 1: Use npm instead of bun (Recommended)
```bash
rmdir /s /q node_modules
npm install
npm run dev
```

### Option 2: Modify package.json to remove --turbopack flag
Change the dev script in package.json from:
```json
"dev": "next dev --turbopack"
```
to:
```json
"dev": "next dev"
```
Then run `bun dev`

### Option 3: Downgrade Next.js
Try using Next.js 15.0.x instead of 15.5.4 which may have better bun compatibility.

## API Keys Required

Once the dev server starts successfully, you will need to configure the following API keys in `.env` and `.env.local`:

1. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** - Get from https://dashboard.clerk.com/
2. **CLERK_SECRET_KEY** - Get from https://dashboard.clerk.com/
3. **NEXT_PUBLIC_CONVEX_URL** - Get from https://dashboard.convex.dev/
4. **CONVEX_DEPLOYMENT** - Get from https://dashboard.convex.dev/

See SETUP_KEYS.md for detailed instructions.
