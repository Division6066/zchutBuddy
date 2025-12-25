# Debug Guide - Login Redirect Issue

## Understanding "debug-session"

**"debug-session"** is a unique session ID generated automatically by the debug utility (`lib/debug.ts`). It helps track all logs from a single debugging session.

- **What it is**: A unique identifier like `session-1234567890-abc123xyz`
- **Where it comes from**: Automatically generated when the debug utility is first used
- **Why it's useful**: Groups all related logs together for easier debugging
- **How to see it**: Check the console logs - each log includes the sessionId

## How Debugging Works

The app uses a centralized debug utility that:

1. **Automatically enables on localhost** - No configuration needed
2. **Logs to browser console** - All `[DEBUG:LEVEL]` messages appear in DevTools
3. **Optional external logging** - Can send logs to an endpoint (if configured)
4. **Structured logging** - Each log includes location, message, and data

## Expected Console Output During Login

When you log in successfully, you should see this sequence in the console:

```
[DEBUG:INFO] [SignInModal.tsx:handleSubmit] Login attempt started
[DEBUG] After signIn.create: {status: "complete", hasSessionId: true, ...}
[DEBUG:INFO] [SignInModal.tsx:handleSubmit] After signIn.create
[DEBUG] Login status is COMPLETE - proceeding with redirect
[DEBUG] Before setActive
[DEBUG:INFO] [SignInModal.tsx:handleSubmit] setActive completed successfully
[DEBUG] setActive completed successfully
[DEBUG:INFO] [SignInModal.tsx:handleSubmit] Login successful, closing modal and redirecting
[DEBUG] After setActive - closing modal and redirecting
[DEBUG] About to redirect: {currentUrl: "http://localhost:3000/", ...}
[DEBUG:INFO] [SignInModal.tsx:handleSubmit] Executing redirect to /app
[DEBUG] Executing redirect to /app
[DEBUG] Current URL before redirect: http://localhost:3000/
[DEBUG] Attempting redirect method 1: window.location.href = "/app"
```

After this, the page should navigate to `/app`.

## Common Issues & What to Look For

### Issue 1: Login Status Not Complete

**What you'll see:**
```
[DEBUG] After signIn.create: {status: "needs_verification", ...}
[DEBUG:WARN] [SignInModal.tsx:handleSubmit] Login status is NOT complete
```

**What it means:** Login requires additional steps (email verification, MFA, etc.)

**How to fix:** Handle these cases in the code or complete the verification in Clerk dashboard.

### Issue 2: setActive Fails

**What you'll see:**
```
[DEBUG] Before setActive
[DEBUG:ERROR] [SignInModal.tsx:handleSubmit] setActive error
[DEBUG] setActive failed but continuing with redirect
```

**What it means:** Session activation failed, but code continues anyway

**How to fix:** Check Clerk configuration and ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is correct.

### Issue 3: Redirect Doesn't Happen

**What you'll see:**
```
[DEBUG] Attempting redirect method 1: window.location.href = "/app"
(But page doesn't change)
```

**What it means:** Browser or React is preventing navigation

**Possible causes:**
- Modal/Dialog blocking navigation
- React state update preventing navigation
- Browser security blocking navigation
- JavaScript error preventing execution

**How to debug:**
1. Check if there are any red error messages in console
2. Check Network tab - is there a request to `/app`?
3. Check if modal actually closed
4. Try manually typing `/app` in address bar - does it work?

### Issue 4: No Debug Messages Appear

**What you'll see:** Nothing in console

**What it means:** 
- Debug utility is disabled
- Code isn't reaching the login flow
- Console is filtered/hidden

**How to fix:**
1. Check if you're on localhost (debug auto-enables on localhost)
2. Check console filters - make sure "All levels" is selected
3. Verify you're actually submitting the login form

## Debugging Checklist

When reporting issues, include:

- [ ] All `[DEBUG]` messages from console (copy/paste)
- [ ] The LAST `[DEBUG]` message you see
- [ ] Any red error messages
- [ ] Final URL in address bar
- [ ] Whether modal closed (yes/no)
- [ ] Whether redirect happened (yes/no)
- [ ] Screenshot of console (if possible)

## How to Enable/Disable Debugging

Debugging is automatically enabled on `localhost`. To control it:

**Environment Variable:**
```bash
NEXT_PUBLIC_DEBUG_ENABLED=true  # Force enable
NEXT_PUBLIC_DEBUG_ENABLED=false # Force disable
```

**External Logging Endpoint:**
```bash
NEXT_PUBLIC_DEBUG_ENDPOINT=http://127.0.0.1:7242/ingest/...
```

## Getting Session ID

To see your current debug session ID:

```javascript
// In browser console
import { debug } from '@/lib/debug';
debug.getSessionId();
```

Or check any log message - the sessionId is included in the log data.

## Next Steps

1. **Test the login flow** following the reproduction steps
2. **Copy all console messages** you see
3. **Note the last message** before redirect (or lack of redirect)
4. **Share the output** so we can identify where the flow stops

