# Auth Redirect Testing Guide

## Implementation Summary

You now have comprehensive logging throughout the authentication flow to debug why magic link redirects are failing. Here's what was implemented:

### New Files Created

1. **lib/auth-debug.ts** - Centralized debug logger with structured `[AUTH]` prefixed logs
2. **components/auth/AuthRedirectHandler.tsx** - Global auth state monitor that handles post-callback redirects
3. **app/api/auth/[...convexAuth]/route.ts** - Explicit Convex Auth route handler with logging

### Modified Files

1. **app/(auth)/sign-in/page.tsx** - Added logging for magic link sending and auth state changes
2. **app/(auth)/sign-up/page.tsx** - Added consistent logging for sign-up flow
3. **middleware.ts** - Enhanced with detailed request and redirect logging
4. **convex/auth.ts** - Added logging for magic link URL generation and email sending
5. **app/layout.tsx** - Added AuthRedirectHandler component globally

## Testing the Magic Link Flow

### Step 1: Start the Development Server

```bash
bun dev
```

### Step 2: Test Sign-In Flow

1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to `http://localhost:3000/sign-in`
4. Look for logs like:
   ```
   [AUTH:INFO] 2026-01-07T10:30:00.000Z | SignIn | MagicLink | Sending magic link email
     email: test@example.com
     redirectTo: /dashboard
   ```

### Step 3: Send Magic Link Email

1. Enter your email and click "Send Magic Link"
2. Watch the console for:
   - Client-side logs showing `signIn()` call
   - Confirmation that magic link was sent
3. Check your email (or email service logs like Resend dashboard)

### Step 4: Check Server Logs

In the terminal running `bun dev`, you should see:

```
[AUTH:INFO] timestamp | MagicLink | URL
  { email: 'test@example.com', hasRedirectTo: true, ... }

[AUTH:INFO] timestamp | MagicLink | Send
  { email: 'test@example.com', redirectTo: '/dashboard', message: '...' }
```

This confirms:
- The magic link URL was generated with `redirectTo` parameter
- The email was sent successfully

### Step 5: Click the Magic Link

1. Copy the magic link from your email
2. Open it in the same browser
3. Watch the console for redirect logs:
   ```
   [AUTH:INFO] timestamp | Callback | Resend
     { hasCode: true, hasRedirectTo: true, ... }
   
   [AUTH:INFO] timestamp | Redirect | Navigate
     message: 'Post-authentication redirect after magic link'
     redirectTo: /dashboard
   ```

### Step 6: Verify Redirect

After clicking the link, you should:
- See logs about authentication success
- Be redirected to `/dashboard`
- See `AuthRedirectHandler` logs if you inspect the console carefully

## Expected Log Output

### Successful Flow Logs

```
[AUTH:INFO] 2026-01-07T10:30:00.000Z | SignIn | MagicLink | Sending magic link email
  email: user@example.com
  redirectTo: /dashboard

[AUTH:INFO] 2026-01-07T10:30:00.500Z | SignIn | MagicLink | Magic link sent successfully
  email: user@example.com
  redirectTo: /dashboard

# Server logs show:
[AUTH:INFO] timestamp | MagicLink | URL
  { hasRedirectTo: true }

[AUTH:INFO] timestamp | MagicLink | Send
  { redirectTo: '/dashboard', message: 'Magic link email sent successfully' }

# After clicking link:
[AUTH:INFO] 2026-01-07T10:30:30.000Z | Middleware | Request
  pathname: /api/auth/callback/resend
  hasCode: true
  hasRedirectTo: true

[AUTH:INFO] 2026-01-07T10:30:30.500Z | AuthRedirectHandler | Auth state updated
  (authenticated: true, loading: false)

[AUTH:INFO] 2026-01-07T10:30:30.600Z | Redirect | Navigate
  message: 'Post-authentication redirect after magic link'
  redirectTo: /dashboard
```

## Troubleshooting Guide

### Issue: No logs appearing in console

**Solution:**
- Check if debugging is enabled: logs only show in development mode or with `NEXT_PUBLIC_DEBUG_ENABLED=true`
- Make sure DevTools Console is open before navigating to the page
- Check for TypeScript/build errors: run `bun run type-check`

### Issue: redirectTo parameter not in magic link URL

**Logs will show:**
```
[AUTH:INFO] | MagicLink | URL
  { hasRedirectTo: false, message: 'Magic link URL generated' }
```

**Debug steps:**
1. Check convex/auth.ts logs for the full URL
2. Verify `redirectTo` is being passed to `signIn()`
3. Check if Convex Auth is properly parsing the parameter

### Issue: Redirect not happening after magic link click

**Logs will show:**
```
[AUTH:INFO] | Middleware | Request
  { hasRedirectTo: true }

[AUTH:INFO] | Callback | Resend
  { hasCode: true, hasRedirectTo: true }
```

But no AuthRedirectHandler logs.

**Debug steps:**
1. Check if `AuthRedirectHandler` is mounted in app/layout.tsx
2. Verify Convex client is initialized in providers.tsx
3. Check for JavaScript errors in browser console
4. Verify the redirectTo URL is valid and accessible

### Issue: Middleware returning before handler runs

**Logs to check:**
```
[AUTH:INFO] | Middleware | Redirect
  { from: '/sign-in', to: '/sign-in' }
```

This suggests middleware is interfering with the callback.

**Debug steps:**
1. Verify API route handler is not blocking the callback
2. Check if authentication state is set correctly after callback
3. Verify redirectTo parameter is not being lost in the flow

## Log Filtering Tips

In browser console, filter for `[AUTH]` prefix:

```javascript
// In DevTools, use this filter:
[AUTH]
```

In server logs, grep for auth logs:

```bash
# Watch only auth logs
bun dev | grep "[AUTH]"
```

## Data Flow Visualization

```
User enters email
  ↓ (client logs)
[AUTH] SignIn sending magic link
  ↓ (Convex Auth)
[AUTH] MagicLink URL generated (server logs)
  ↓ (Email)
Magic link URL emailed to user
  ↓ (User clicks link)
Request to /api/auth/callback/resend
  ↓ (Middleware logs)
[AUTH] Middleware processing callback
  ↓ (Convex Auth handler)
[AUTH] Callback processing complete
  ↓ (Client redirect)
[AUTH] AuthRedirectHandler detects authenticated
  ↓ (Client-side redirect)
[AUTH] Redirect to dashboard
```

## Next Steps After Testing

1. **If redirect works correctly**: Great! The logging infrastructure is in place for future debugging.

2. **If redirect fails**: Use the logs to identify exactly where the flow breaks and share the logs for targeted fixes.

3. **Production monitoring**: 
   - The logging is environment-aware (only active in dev)
   - For production, consider using a proper logging service
   - Logs are non-blocking and won't impact performance

## Disabling Debug Logging

To disable debug logs:
- Remove `NEXT_PUBLIC_DEBUG_ENABLED=true` from `.env.local`
- Logs are automatically disabled in production (`NODE_ENV === 'production'`)
- On non-localhost domains, logs are also disabled

## Integration with Existing Debug Utility

The new `authDebug` logger integrates with the existing `lib/debug.ts` utility:
- Uses same logging principles
- Follows project patterns
- Can be extended in the future

---

**Remember:** All logs are prefixed with `[AUTH]` for easy filtering and debugging. Use browser DevTools Console and terminal output to trace the entire authentication flow.

