import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-dark mb-4">
            אודות ZchuyotBuddy
          </h1>
          <p className="text-lg text-text-subtle max-w-2xl mx-auto">
            ה-GPS לזכויות שלך - וטייס-משנה לניירת
          </p>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-dark mb-4">המשימה שלנו</h2>
          <p className="text-text-subtle leading-relaxed mb-4">
            ZchuyotBuddy נוצר מתוך הבנה שנווט בבירוקרטיה הישראלית, במיוחד בתחום הזכויות הרפואיות, 
            הוא משימה מורכבת ומתישה עבור רבים. אנחנו כאן כדי לפשט את התהליך ולעזור לכם לקבל את מה שמגיע לכם.
          </p>
          <p className="text-text-subtle leading-relaxed">
            המערכת שלנו משלבת בינה מלאכותית מתקדמת עם ידע מעמיק בזכויות רפואיות כדי להנגיש מידע, 
            להכין מסמכים ולהוביל אתכם צעד אחר צעד בתהליך מימוש הזכויות.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-text-dark mb-6">הערכים שלנו</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="accessibility" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-2">נגישות</h3>
              <p className="text-text-subtle text-sm">
                הפיכת מידע מורכב לפשוט ונגיש לכולם
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="verified_user" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-2">אמינות</h3>
              <p className="text-text-subtle text-sm">
                מידע מדויק ומעודכן שאפשר לסמוך עליו
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="support_agent" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-text-dark mb-2">תמיכה</h3>
              <p className="text-text-subtle text-sm">
                ליווי אישי לאורך כל התהליך
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-primary/5 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-text-dark mb-4">מוכנים להתחיל?</h2>
          <p className="text-text-subtle mb-6">
            גלו אילו זכויות מגיעות לכם והתחילו את התהליך עוד היום
          </p>
          <Link href="/onboarding">
            <Button className="bg-primary text-white hover:bg-[#5b38c4] px-8 py-3 rounded-xl font-semibold">
              התחילו עכשיו
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}

