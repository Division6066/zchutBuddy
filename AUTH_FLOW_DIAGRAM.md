# Authentication Flow with Logging Points

## Complete Magic Link Flow with Debug Logging

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION FLOW                          │
│                    (with logging checkpoints)                        │
└─────────────────────────────────────────────────────────────────────┘

                                                    
PHASE 1: SIGN-IN REQUEST
═════════════════════════════════════════════════════════════════════

  [BROWSER]                           [SERVER]
    │
    │  User enters email & clicks    
    │  "Send Magic Link"
    │
    ├─► 📝 LOG: SignIn | MagicLink
    │      email: user@example.com
    │      redirectTo: /dashboard
    │
    │  Call signIn("resend", {...})
    │     │
    │     └──► Request to Convex Auth
    │              │
    │              ├─► 📝 LOG: MagicLink | URL
    │              │      URL generated with redirectTo param
    │              │
    │              ├─► 📝 LOG: MagicLink | Params
    │              │      Extract redirectTo: /dashboard
    │              │
    │              └──► POST to Resend API
    │                     │
    │                     ├─► 📝 LOG: MagicLink | Send
    │                     │      Email sent successfully
    │                     │      redirectTo: /dashboard
    │                     │
    │                     └──► Email arrives at user inbox
    │
    ├─► 📝 LOG: SignIn | MagicLink
    │      Magic link sent successfully
    │
    └─► Show "Check your email" message


PHASE 2: MAGIC LINK CLICK
═════════════════════════════════════════════════════════════════════

  [USER EMAIL]              [BROWSER]                [SERVER]
    │                          │
    │ User clicks              │
    │ magic link in email      │
    │───────────────────────►  │
    │                          │
    │                    Request to:
    │                    /api/auth/callback/resend
    │                    ?code=XXX&redirectTo=/dashboard
    │                          │
    │                          ├──► 📝 LOG: Middleware | Request
    │                          │      Processing callback
    │                          │      hasCode: true
    │                          │      hasRedirectTo: true
    │                          │
    │                          └──► Route Handler
    │                                  │
    │                                  ├─► 📝 LOG: Callback | Resend
    │                                  │      Magic link callback detected
    │                                  │      code: present
    │                                  │      redirectTo: /dashboard
    │                                  │
    │                                  └──► Convex Auth processing
    │                                         │
    │                                         ├─► Verify code
    │                                         ├─► Create/Update user
    │                                         ├─► Set session
    │                                         │
    │                                         └─► 📝 LOG: Auth | StateChange
    │                                              authenticated: true
    │
    │                          ← Session cookie set
    │                          ├─► 📝 LOG: Middleware | Redirect
    │                          │      Authenticated, allow access
    │
    │                    Page loads
    │                          │
    │                          ├─► Providers initialize
    │                          │    Convex Auth context updated
    │                          │
    │                          ├─► AuthRedirectHandler mounts
    │                          │    │
    │                          │    ├─► 📝 LOG: Auth | StateChange
    │                          │    │      isAuthenticated: true
    │                          │    │      isLoading: false
    │                          │    │
    │                          │    ├─► Check URL params
    │                          │    │    code: detected
    │                          │    │    redirectTo: /dashboard
    │                          │    │
    │                          │    ├─► 📝 LOG: Callback | Resend
    │                          │    │      Magic link callback detected
    │                          │    │
    │                          │    ├─► 📝 LOG: Redirect | Navigate
    │                          │    │      Post-authentication redirect
    │                          │    │      target: /dashboard
    │                          │    │
    │                          │    └─► router.push("/dashboard")
    │                          │
    │                    ← Redirect to /dashboard
    │                          │
    │                    [DASHBOARD PAGE LOADS]
    │                          ✓ Success!
```


## Log Inspection Points

Use these locations to inspect logs at each phase:

### 🔍 PHASE 1: Sign-In Request

**Browser Console (F12 → Console):**
```
Search for: [AUTH] SignIn
Expected: 
  - "Sending magic link email" with email and redirectTo
  - "Magic link sent successfully" after completion
```

**Server Terminal:**
```
Search for: [AUTH] MagicLink
Expected:
  - "Magic link URL generated" with hasRedirectTo: true
  - "Magic link parameters" with redirectTo: /dashboard
  - "Magic link email sent successfully"
```

### 🔍 PHASE 2: Magic Link Click

**Browser Console:**
```
Search for: [AUTH] Callback
Expected:
  - "Callback detected" with hasCode: true, hasRedirectTo: true
```

**Server Terminal:**
```
Search for: [AUTH] Middleware
Expected:
  - "Request to /api/auth/callback/resend" with params
```

### 🔍 PHASE 3: Post-Auth Redirect

**Browser Console:**
```
Search for: [AUTH] Redirect
Expected:
  - "Post-authentication redirect after magic link"
  - target: /dashboard or /onboarding
```

**Browser Console:**
```
Search for: [AUTH] Auth
Expected:
  - "Auth state updated (authenticated: true, loading: false)"
```


## Troubleshooting Decision Tree

```
                    Magic Link Issue?
                           │
           ┌───────────────┴───────────────┐
           │                               │
    Email not received?         Click link, no redirect?
           │                               │
           ▼                               ▼
    Check "MagicLink | Send"      Check "Callback | Resend"
    logs in server terminal           logs in browser
           │                               │
    ┌──────┴──────┐                   ┌───┴────┐
    │             │                   │        │
  ERROR         hasRedirectTo:    CODE    REDIRECTTO
    ▼           false?              ▼        ▼
  Show           │                Check   Check for
  error from   Try without      for      "Redirect |
  Resend API    redirectTo       errors   Navigate" log
                 in               in
              convex/auth.ts   console


           No Redirect Logs?
                 │
      ┌──────────┼──────────┐
      │          │          │
  AuthRedirect    No logs   Auth state
  not mounted     at all?   not updating?
      │          │          │
  Check        Check        Check
  app/layout   middleware   isAuthenticated
  .tsx imports  logs        in browser
```


## Key Environment Variables

To enable debugging (if not in development):

```bash
# .env.local
NEXT_PUBLIC_DEBUG_ENABLED=true
```

## What Each Log Component Shows

| Component | Purpose |
|-----------|---------|
| SignIn | Sign-in page user actions |
| SignUp | Sign-up page user actions |
| Auth | Global authentication state changes |
| MagicLink | Magic link generation and delivery |
| Callback | Magic link callback processing |
| Middleware | Request routing and redirects |
| Redirect | Navigation decisions |
| Email | Email delivery status |

---

**Use this flow diagram to understand exactly where to look for each phase of the authentication process.**

