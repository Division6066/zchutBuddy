import FeatureCard from "./FeatureCard";

export default function WhyChooseSection() {
  return (
    <section className="w-full max-w-4xl mb-12 px-4" aria-labelledby="why-choose-heading">
      <h2
        id="why-choose-heading"
        className="text-text-dark text-center text-2xl md:text-3xl font-bold mb-8"
      >
        למה לבחור ב-ZchuyotBuddy?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <FeatureCard
          icon="description"
          title="ניהול תביעות חכם"
          description="השלמת מסמכים רפואיים בקלות"
          iconColor="primary"
        />
        <FeatureCard
          icon="assignment"
          title="צ'ק-ליסט בירוקרטי"
          description="מעקב אחר הצעדים הבאים"
          iconColor="blue"
        />
        <FeatureCard
          icon="settings"
          title="הפקת מסמכים אוטומטית"
          description="צור ערכות מסמכים בלחיצה"
          iconColor="orange"
        />
      </div>
    </section>
  );
}
