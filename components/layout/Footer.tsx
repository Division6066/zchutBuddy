"use client";

import Link from "next/link";
import { useToggleLocale, useTranslation } from "@/lib/i18n";

export default function Footer() {
  const { t, locale } = useTranslation();
  const toggleLocale = useToggleLocale();

  const footerLinks = [
    { href: "/features", label: t("nav.features") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
    { href: "/pricing", label: t("nav.pricing") },
  ];

  const legalLinks = [
    { href: "/privacy", label: t("footer.links.privacy") },
    { href: "/terms", label: t("footer.links.terms") },
  ];

  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">accessibility_new</span>
              </div>
              <span className="text-xl font-bold text-foreground">{t("common.appName")}</span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">{t("footer.description")}</p>

            {/* Language Toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <span className="material-symbols-outlined text-sm">language</span>
              <span className="text-sm font-medium">{locale === "en" ? "עברית" : "English"}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">{t("nav.features")}</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-foreground mb-4">{t("footer.links.contact")}</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t("footer.links.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
