# Debug Capabilities Summary

## What You Can Now Debug

### ✅ Magic Link Generation
- **Log source:** `convex/auth.ts` server logs
- **What it shows:** 
  - Full magic link URL being generated
  - Whether `redirectTo` parameter is included
  - The actual redirectTo value being used
- **How to use:** If link doesn't redirect, confirm redirectTo is in the URL here

### ✅ Email Sending
- **Log source:** `convex/auth.ts` server logs  
- **What it shows:**
  - Whether email was sent successfully
  - Recipient email address
  - Error details if sending failed
- **How to use:** If user doesn't receive email, check this log

### ✅ User Sign-In Request
- **Log source:** Browser console (F12)
- **What it shows:**
  - Email entered by user
  - redirectTo parameter being sent
  - Response from Convex Auth (success/error)
- **How to use:** Verify redirectTo is being passed to signIn() call

### ✅ Middleware Request Handling
- **Log source:** Server terminal
- **What it shows:**
  - Request path (e.g., /sign-in, /api/auth/callback/resend)
  - Whether user is authenticated
  - What action middleware is taking (allow/redirect)
  - Redirect target if applicable
- **How to use:** Trace request flow through middleware

### ✅ Magic Link Callback Processing
- **Log source:** Server terminal + Browser console
- **What it shows:**
  - Whether code parameter is present
  - Whether redirectTo is present
  - What parameters are being passed
- **How to use:** Confirm callback URL has correct parameters

### ✅ Authentication State Changes
- **Log source:** Browser console (F12)
- **What it shows:**
  - When isAuthenticated becomes true
  - Loading state (true/false)
  - When redirect decision is made
- **How to use:** Verify auth state is updating after callback

### ✅ Redirect Decisions
- **Log source:** Browser console (F12)
- **What it shows:**
  - Source of redirect (middleware, SignInPage, AuthRedirectHandler)
  - Target URL (/dashboard, /onboarding, etc.)
  - Reason for redirect
  - Authenticated status at time of redirect
- **How to use:** Understand why redirects are/aren't happening

### ✅ API Route Callback Processing
- **Log source:** Server logs
- **What it shows:**
  - Incoming callback requests to /api/auth/[...convexAuth]
  - Parameters in the callback URL
  - Whether handler processed it
- **How to use:** Confirm callback is being received by server

---

## Common Issues You Can Now Diagnose

| Issue | Where to Check | What to Look For |
|-------|---|---|
| User not redirected to /dashboard | Browser console [AUTH] logs | Look for "Post-authentication redirect" log |
| redirectTo parameter missing | Server logs in convex/auth.ts | Check "hasRedirectTo: false" in MagicLink logs |
| Email not received | Server logs in convex/auth.ts | Look for "Magic link email sent successfully" or error |
| Authentication not persisting | Browser console [AUTH] logs | Check "Auth state updated (authenticated: true)" |
| Callback not being processed | Server terminal | Look for /api/auth/callback/resend request logs |
| Stuck on sign-in page after click | Browser + server logs | Check for any ERROR level logs |
| Redirect to wrong page | Browser console [AUTH] logs | Check target in "Redirect" logs |

---

## Log Collection for Support

If you need help debugging, collect these logs:

### Browser Console Logs
1. Open DevTools (F12)
2. Go to Console tab
3. Filter for `[AUTH]`
4. Screenshot or copy-paste all logs from start to where it fails

### Server Logs
1. Look at terminal running `bun dev`
2. Capture all output from when user clicks email to when redirect fails
3. Copy the section with `[AUTH]` logs

### Both Together
Document:
- What time each action happened
- Which logs appeared on browser vs server
- Where the flow stopped (which log was the last one?)

---

## Testing Scenarios

With this logging, you can test:

### ✓ Basic Sign-In
1. Enter email at /sign-in
2. Verify logs show email and redirectTo
3. Confirm email is sent
4. Click link
5. Verify redirect to /dashboard

### ✓ Sign-Up Flow
1. Enter email at /sign-up
2. Same as above but redirectTo should be /onboarding
3. Verify redirect to /onboarding

### ✓ Already Authenticated Users
1. Sign in with one browser tab
2. Visit /sign-in in same tab
3. Should immediately redirect to /dashboard
4. Verify middleware logs show the redirect

### ✓ Callback Parameter Extraction
1. Manually construct callback URL with redirectTo
2. Verify AuthRedirectHandler detects and parses it
3. Confirm redirect happens to specified target

### ✓ Error Handling
1. Try sending email with invalid address
2. Verify error logs appear in both browser and server
3. Check error message is displayed to user

---

## Advanced Debugging

### Finding Timing Issues
Search logs for timestamps and calculate delays:
```
10:30:00 - User clicks send
10:30:01 - Email sent (1 second OK)
10:30:30 - User clicks link
10:30:30 - Middleware logs request (immediate OK)
10:30:31 - AuthRedirectHandler logs (1 second delay OK)
```

### Finding Missing Parameters
Look for:
- `hasRedirectTo: false` - redirectTo param not in URL
- `redirectTo: undefined` - parameter parsed but empty
- `redirectParam || "/dashboard"` fallback being used

### Finding Redirect Loops
Search for multiple "Redirect" logs for same user:
- First redirect OK
- Second redirect = loop detected
- Check middleware isAuthRoute logic

### Finding Callback Failures
Look for progression:
- "Request" log = callback arrived
- Missing "Redirect" log = processing failed
- No "AuthRedirectHandler" logs = component not mounted

---

## Next Steps After Debugging

1. **Identify the exact failure point** using logs
2. **Document which log is missing** or shows unexpected value
3. **Share logs** if need help with fix
4. **Logs stay in place** for future debugging

All logging is non-invasive and can stay in production (though it's automatically disabled in production builds).

