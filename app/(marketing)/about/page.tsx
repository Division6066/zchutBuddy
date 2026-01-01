"use client";

import { useTranslation } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    {
      icon: "favorite",
      title: "אמפתיה",
      description: "אנחנו מבינים את האתגרים שלך ופה כדי לעזור",
    },
    {
      icon: "verified_user",
      title: "אמינות",
      description: "מידע מדויק ומעודכן ממקורות רשמיים בלבד",
    },
    {
      icon: "accessibility_new",
      title: "נגישות",
      description: "פלטפורמה פשוטה וקלה לשימוש לכולם",
    },
    {
      icon: "groups",
      title: "קהילה",
      description: "יחד אנחנו יכולים לעשות שינוי",
    },
  ];

  const team = [
    {
      name: "צוות הפיתוח",
      role: "מהנדסי תוכנה",
      description: "צוות מנוסה של מפתחים שמחויבים ליצירת חוויה מעולה",
    },
    {
      name: "צוות התוכן",
      role: "מומחי זכויות",
      description: "אנשי מקצוע עם ידע מעמיק במערכת הביטחון הסוציאלי",
    },
    {
      name: "צוות התמיכה",
      role: "שירות לקוחות",
      description: "זמינים לעזור לך בכל שאלה או בעיה",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-primary/10 via-background to-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            {t("about.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("about.mission")}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full bg-card py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-foreground mb-6">למה אנחנו עושים את זה</h2>
              <p className="text-muted-foreground mb-4">
                מערכת הביטחון הסוציאלי בישראל מורכבת ומסובכת. אלפי ישראלים מפסידים זכויות שמגיעות
                להם פשוט כי הם לא יודעים עליהן או לא יודעים איך לממש אותן.
              </p>
              <p className="text-muted-foreground mb-4">
                זכויות באדי נוצר כדי לשנות את זה. אנחנו משתמשים בטכנולוגיה מתקדמת כדי להפוך את תהליך
                מיצוי הזכויות לפשוט, נגיש ויעיל.
              </p>
              <p className="text-muted-foreground">
                המשימה שלנו היא לוודא שכל אזרח ישראלי יקבל את מה שמגיע לו - ללא בירוקרטיה מיותרת
                וללא ויתור על זכויות.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 rounded-full bg-primary/10" />
                <div className="absolute inset-8 rounded-full bg-card border-4 border-white shadow-2xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-primary">
                    volunteer_activism
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-foreground mb-12 text-center">הערכים שלנו</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-card p-6 rounded-2xl border border-border text-center">
                <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-2xl">{value.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full bg-card py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-foreground mb-12 text-center">הצוות שלנו</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-background p-8 rounded-2xl border border-border text-center"
              >
                <div className="size-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-4xl">groups</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                <p className="text-muted-foreground">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
