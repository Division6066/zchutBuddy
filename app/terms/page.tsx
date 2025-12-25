export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-dark mb-4">
            תנאי שימוש
          </h1>
          <p className="text-sm text-text-subtle">
            עודכן לאחרונה: דצמבר 2025
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-text-dark">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. קבלת התנאים</h2>
            <p className="text-text-subtle leading-relaxed">
              בכניסתכם לאתר ZchuyotBuddy או בשימוש בו, אתם מסכימים להיות מחויבים לתנאי שימוש אלה. 
              אם אינכם מסכימים לתנאים אלה, אנא הימנעו משימוש בשירות.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. תיאור השירות</h2>
            <p className="text-text-subtle leading-relaxed mb-4">
              ZchuyotBuddy מספקת פלטפורמה לסיוע בזיהוי זכויות רפואיות והכנת מסמכים. השירות כולל:
            </p>
            <ul className="list-disc list-inside text-text-subtle space-y-2 mr-4">
              <li>זיהוי זכויות רפואיות פוטנציאליות</li>
              <li>הכנה והפקת מסמכים</li>
              <li>מעקב אחר תהליכי תביעה</li>
              <li>מידע והדרכה בנושא זכויות</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. הגבלת אחריות</h2>
            <p className="text-text-subtle leading-relaxed mb-4">
              <strong>חשוב:</strong> השירות שלנו מספק מידע והדרכה כללית בלבד. 
              הוא אינו מהווה ייעוץ משפטי, רפואי או פיננסי מקצועי.
            </p>
            <p className="text-text-subtle leading-relaxed">
              אנו ממליצים להתייעץ עם אנשי מקצוע מוסמכים לפני קבלת החלטות משמעותיות. 
              ZchuyotBuddy אינה אחראית לתוצאות הנובעות מהסתמכות על המידע המסופק בפלטפורמה.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. חשבון משתמש</h2>
            <p className="text-text-subtle leading-relaxed mb-4">
              בעת יצירת חשבון, אתם מתחייבים:
            </p>
            <ul className="list-disc list-inside text-text-subtle space-y-2 mr-4">
              <li>לספק מידע מדויק ועדכני</li>
              <li>לשמור על סודיות פרטי הגישה שלכם</li>
              <li>להודיע לנו מיד על כל שימוש לא מורשה בחשבונכם</li>
              <li>לא לשתף את החשבון עם אחרים</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. שימוש אסור</h2>
            <p className="text-text-subtle leading-relaxed mb-4">
              אתם מתחייבים לא להשתמש בשירות למטרות הבאות:
            </p>
            <ul className="list-disc list-inside text-text-subtle space-y-2 mr-4">
              <li>פעילות בלתי חוקית או הונאה</li>
              <li>הפרת זכויות של צדדים שלישיים</li>
              <li>הפצת תוכן מזיק או פוגעני</li>
              <li>ניסיון לפרוץ או לשבש את השירות</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. קניין רוחני</h2>
            <p className="text-text-subtle leading-relaxed">
              כל התוכן, העיצוב והטכנולוגיה של ZchuyotBuddy הם רכושנו או של מעניקי הרישיון שלנו. 
              אין להעתיק, לשנות או להפיץ כל חלק מהשירות ללא אישור מפורש בכתב.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. שינויים בתנאים</h2>
            <p className="text-text-subtle leading-relaxed">
              אנו שומרים לעצמנו את הזכות לעדכן תנאים אלה מעת לעת. 
              שינויים מהותיים יפורסמו באתר ותקבלו הודעה בהתאם.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. יצירת קשר</h2>
            <p className="text-text-subtle leading-relaxed">
              לכל שאלה בנוגע לתנאי השימוש, אנא צרו קשר בכתובת: 
              <a href="mailto:legal@zchuyotbuddy.com" className="text-primary hover:underline mr-1">
                legal@zchuyotbuddy.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

