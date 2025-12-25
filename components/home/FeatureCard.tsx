import { Icon } from "@/components/ui/icon";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  iconColor?: "primary" | "blue" | "orange";
}

const iconColorClasses = {
  primary: "bg-primary/10 text-primary",
  blue: "bg-blue-50 text-blue-500",
  orange: "bg-orange-50 text-orange-500",
};

const iconTextClasses = {
  primary: "text-primary",
  blue: "text-blue-500",
  orange: "text-orange-500",
};

export default function FeatureCard({ icon, title, description, iconColor = "primary" }: FeatureCardProps) {
  return (
    <article className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:scale-[1.02]">
      <div className={`w-12 h-12 rounded-xl ${iconColorClasses[iconColor]} flex items-center justify-center mb-4`}>
        <Icon name={icon} size={24} className={iconTextClasses[iconColor]} />
      </div>
      <h3 className="text-text-dark font-bold text-lg mb-2">{title}</h3>
      <p className="text-text-subtle text-sm leading-relaxed">{description}</p>
    </article>
  );
}

