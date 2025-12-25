# ZchuyotBuddy-Web-V2 Project Notes

## Project Information

**Project Root:** `C:\Users\User\Projects\ZchuyotBuddy-Web-V2`

**Template Source:** Nir's web-template (React + TypeScript / Next.js with RTL/Hebrew support)

**Created:** December 22, 2025

## Technology Stack

- **Framework:** Next.js 15.5.4
- **Language:** TypeScript
- **UI Library:** React 19.1.0
- **Styling:** Tailwind CSS 4.1.14
- **Authentication:** Clerk
- **Backend:** Convex
- **Package Manager:** Bun 1.3.5 (or npm as fallback)
- **Node Version:** v24.11.1

## How to Run

### Installation
```bash
bun install
# OR if bun has issues:
npm install
```

### Development Server
```bash
bun dev
# OR if bun has issues:
npm run dev
```

**Note:** There is currently a known issue with the dev server. See `RUN_ERROR.md` for details and solutions.

### Build for Production
```bash
bun run build
# OR
npm run build
```

### Start Production Server
```bash
bun start
# OR
npm start
```

## Project Structure

### Routes/Pages

The following skeleton routes have been created:

1. **/** - Home/Landing page (already existed with Hebrew content)
2. **/onboarding** - Questionnaire wizard placeholder
3. **/pricing** - Payment/pricing plans placeholder
4. **/app** - Main application/dashboard placeholder
5. **/settings** - User settings placeholder

All routes are simple placeholders with basic structure, ready for content implementation.

### Navigation

The navbar (`components/Navbar.tsx`) has been updated to include links to all 5 routes:
- Home (icon)
- Onboarding
- Pricing
- App
- Settings

The navbar also includes:
- Clerk authentication integration (sign in/sign out)
- User profile dropdown
- RTL (right-to-left) layout support for Hebrew

### Sample Pages

The template originally included sample pages (page1, page2, page3) which are still in the `/app` directory but have been removed from the navigation.

## Environment Variables

### Required API Keys

Before the app can run successfully, you need to configure API keys in both `.env` and `.env.local`:

1. **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** - Clerk authentication
2. **CLERK_SECRET_KEY** - Clerk authentication (secret)
3. **NEXT_PUBLIC_CONVEX_URL** - Convex backend
4. **CONVEX_DEPLOYMENT** - Convex deployment ID

**See `SETUP_KEYS.md` for detailed instructions on obtaining and configuring these keys.**

### Security

- All `.env*` files are excluded from git via `.gitignore`
- Real API keys have been replaced with placeholders
- Never commit real keys to version control

## Next Steps

### Immediate

1. **Fix dev server issue** - See `RUN_ERROR.md` for solutions
2. **Configure API keys** - Follow instructions in `SETUP_KEYS.md`
3. **Test all routes** - Verify navigation works correctly

### Future Development

1. **Stitch Design Integration**
   - Create a `/design/stitch-export/` directory
   - Drop Stitch export zip files there
   - Import components and styles into the project

2. **Implement Route Content**
   - Build out the onboarding questionnaire wizard
   - Create pricing plans and payment integration
   - Develop the main app/dashboard interface
   - Add settings page functionality

3. **Authentication Flow**
   - Configure Clerk authentication properly
   - Set up protected routes
   - Add user profile management

4. **Backend Integration**
   - Set up Convex functions
   - Create database schema
   - Implement API endpoints

## Files Created

- `SETUP_KEYS.md` - API key setup instructions
- `RUN_ERROR.md` - Development server error documentation
- `PROJECT_NOTES.md` - This file
- `/app/onboarding/page.tsx` - Onboarding route
- `/app/pricing/page.tsx` - Pricing route
- `/app/app/page.tsx` - Main app route
- `/app/settings/page.tsx` - Settings route

## Files Modified

- `components/Navbar.tsx` - Updated navigation links
- `.env` - Replaced real keys with placeholders
- `.env.local` - Replaced real keys with placeholders

## Known Issues

1. **Dev server won't start** - See `RUN_ERROR.md` for details and solutions
2. **Missing API keys** - App requires Clerk and Convex configuration

## Support

For questions or issues, refer to:
- Next.js documentation: https://nextjs.org/docs
- Clerk documentation: https://clerk.com/docs
- Convex documentation: https://docs.convex.dev/
