import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import type { EmailConfig } from "@auth/core/providers/email";

// Custom Resend provider that avoids html-to-text dependencies
function createResendProvider(): EmailConfig | null {
  if (!process.env.AUTH_RESEND_KEY || !process.env.AUTH_EMAIL_FROM) {
    return null;
  }

  return {
    id: "resend",
    type: "email",
    name: "Resend",
    from: process.env.AUTH_EMAIL_FROM,
    maxAge: 24 * 60 * 60, // 24 hours
    async sendVerificationRequest({ identifier: to, url, provider }) {
      const { host } = new URL(url);
      
      // Simple HTML email without html-to-text dependency
      const html = `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #111827;">שלום!</h2>
          <p style="color: #374151; font-size: 16px;">לחץ על הקישור הבא כדי להתחבר לחשבון שלך:</p>
          <p style="margin: 24px 0;">
            <a href="${url}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              התחבר
            </a>
          </p>
          <p style="color: #6b7280; font-size: 14px;">או העתק והדבק את הקישור הבא בדפדפן שלך:</p>
          <p style="word-break: break-all; color: #6b7280; font-size: 12px; background: #f3f4f6; padding: 12px; border-radius: 4px;">${url}</p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">אם לא ביקשת קישור זה, תוכל להתעלם מהמייל הזה.</p>
        </div>
      `;
      
      const text = `שלום! לחץ על הקישור הבא כדי להתחבר: ${url}`;

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: provider.from,
          to,
          subject: `Sign in to ${host}`,
          html,
          text,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(`Resend error: ${JSON.stringify(error)}`);
      }
    },
  };
}

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    // Google OAuth
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    // Email OTP via Resend (custom implementation)
    ...(createResendProvider() ? [createResendProvider()!] : []),
  ],
});

