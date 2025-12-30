"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: "mail",
      title: "אימייל",
      value: "support@zchuyotbuddy.co.il",
      link: "mailto:support@zchuyotbuddy.co.il",
    },
    {
      icon: "phone",
      title: "טלפון",
      value: "03-123-4567",
      link: "tel:031234567",
    },
    {
      icon: "schedule",
      title: "שעות פעילות",
      value: "א׳-ה׳ 9:00-18:00",
      link: null,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary/10 via-background to-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-2xl border border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                שלח לנו הודעה
              </h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="size-16 rounded-full bg-success-bg text-success flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">ההודעה נשלחה!</h3>
                  <p className="text-muted-foreground">
                    תודה על פנייתך. נחזור אליך בהקדם האפשרי.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-primary hover:text-primary-dark font-medium"
                  >
                    שלח הודעה נוספת
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      {t("contact.form.name")}
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      {t("contact.form.email")}
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                      {t("contact.form.subject")}
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition-all shadow-primary disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>שולח...</span>
                      </div>
                    ) : (
                      t("contact.form.send")
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  דרכי התקשרות
                </h2>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div
                      key={index}
                      className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4"
                    >
                      <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-xl">{method.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{method.title}</h3>
                        {method.link ? (
                          <a
                            href={method.link}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {method.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{method.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Link */}
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                <h3 className="font-bold text-foreground mb-2">יש לך שאלה?</h3>
                <p className="text-muted-foreground mb-4">
                  בדוק את דף השאלות הנפוצות שלנו - אולי התשובה כבר שם
                </p>
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  לשאלות נפוצות
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

