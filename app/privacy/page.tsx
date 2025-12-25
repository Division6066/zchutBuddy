export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-dark mb-4">
            מדיניות פרטיות
          </h1>
          <p className="text-sm text-text-subtle">
            עודכן לאחרונה: דצמבר 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-text-dark">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. מבוא</h2>
            <p className="text-text-subtle leading-relaxed mb-4">
              ZchuyotBuddy ("אנחנו", "שלנו") מחויבת להגן על פרטיותכם. מדיניות פרטיות זו מסבירה 
              כיצד אנו אוספים, משתמשים ומגנים על המידע שלכם כאשר אתם משתמשים בשירות שלנו.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. מידע שאנו אוספים</h2>
            <p className="text-text-subtle leading-relaxed mb-4">
              אנו עשויים לאסוף את סוגי המידע הבאים:
            </p>
            <ul className="list-disc list-inside text-text-subtle space-y-2 mr-4">
              <li>מידע אישי: שם, כתובת דוא"ל, מספר טלפון</li>
              <li>מידע רפואי: פרטים הנחוצים לצורך זיהוי זכויות</li>
              <li>מידע טכני: כתובת IP, סוג דפדפן, מכשיר</li>
              <li>מידע שימוש: אינטראקציות עם השירות שלנו</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. שימוש במידע</h2>
            <p className="text-text-subtle leading-relaxed mb-4">
              אנו משתמשים במידע שנאסף למטרות הבאות:
            </p>
            <ul className="list-disc list-inside text-text-subtle space-y-2 mr-4">
              <li>מתן השירותים שלנו וזיהוי זכויות</li>
              <li>שיפור והתאמה אישית של חוויית המשתמש</li>
              <li>תקשורת אתכם בנוגע לשירותים</li>
              <li>עמידה בדרישות חוקיות</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. אבטחת מידע</h2>
            <p className="text-text-subtle leading-relaxed">
              אנו מיישמים אמצעי אבטחה טכניים וארגוניים מתאימים להגנה על המידע שלכם מפני גישה, 
              שינוי, חשיפה או השמדה לא מורשים. זה כולל הצפנה, בקרות גישה וניטור אבטחה רציף.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. זכויותיכם</h2>
            <p className="text-text-subtle leading-relaxed mb-4">
              יש לכם את הזכויות הבאות בנוגע למידע שלכם:
            </p>
            <ul className="list-disc list-inside text-text-subtle space-y-2 mr-4">
              <li>זכות גישה למידע האישי שלכם</li>
              <li>זכות לתיקון מידע לא מדויק</li>
              <li>זכות למחיקת המידע</li>
              <li>זכות להגבלת עיבוד</li>
              <li>זכות לניידות מידע</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. יצירת קשר</h2>
            <p className="text-text-subtle leading-relaxed">
              לכל שאלה בנוגע למדיניות הפרטיות שלנו, אנא צרו קשר בכתובת: 
              <a href="mailto:privacy@zchuyotbuddy.com" className="text-primary hover:underline mr-1">
                privacy@zchuyotbuddy.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

