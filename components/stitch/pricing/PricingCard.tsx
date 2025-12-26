interface PricingFeature {
  text: string;
}

interface PricingCardProps {
  /** Plan name */
  name: string;
  /** Hebrew name */
  hebrewName: string;
  /** Short description */
  description: string;
  /** Price in ILS */
  price: number;
  /** List of features */
  features: PricingFeature[];
  /** Is this the featured/popular plan */
  featured?: boolean;
  /** Is this the premium/max plan */
  premium?: boolean;
}

/**
 * Pricing plan card component
 */
export default function PricingCard({
  name,
  hebrewName,
  description,
  price,
  features,
  featured = false,
  premium = false,
}: PricingCardProps) {
  if (premium) {
    return (
      <div className="bg-gradient-to-br from-[#2b1c4e] to-[#4c3575] rounded-2xl p-5 shadow-lg relative overflow-hidden text-white mb-6">
        <div
          className="absolute top-[-20%] right-[-20%] w-[150px] h-[150px] bg-white/10 rounded-full blur-2xl"
          aria-hidden="true"
        />
        <div className="flex justify-between items-start mb-3 relative z-10">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              {hebrewName} ({name})
              <span className="material-symbols-outlined text-amber-400 text-sm" aria-hidden="true">
                crown
              </span>
            </h3>
            <p className="text-xs text-gray-300 mt-1">{description}</p>
          </div>
          <div className="text-right relative z-10">
            <span className="text-2xl font-extrabold text-white">₪{price}</span>
            <span className="text-xs text-gray-300 block">לחודש</span>
          </div>
        </div>
        <div className="h-px w-full bg-white/20 my-3 relative z-10" />
        <ul className="space-y-2.5 relative z-10">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-gray-100">
              <span
                className="material-symbols-outlined text-amber-400 text-[18px] check-icon"
                aria-hidden="true"
              >
                check_circle
              </span>
              {feature.text}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (featured) {
    return (
      <div className="bg-white rounded-2xl p-1 border-2 border-primary shadow-soft relative overflow-hidden transform scale-[1.02]">
        <div className="absolute top-0 left-0 right-0 bg-primary text-white text-[10px] font-bold text-center py-1 uppercase tracking-wider">
          הכי פופולרי
        </div>
        <div className="p-5 pt-8">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-lg text-primary">
                {hebrewName} ({name})
              </h3>
              <p className="text-xs text-text-subtle mt-1">{description}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-primary">₪{price}</span>
              <span className="text-xs text-text-subtle block">לחודש</span>
            </div>
          </div>
          <div className="h-px w-full bg-gray-100 my-3" />
          <ul className="space-y-2.5">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-text-dark font-medium"
              >
                <span
                  className="material-symbols-outlined text-primary text-[18px] check-icon"
                  aria-hidden="true"
                >
                  check_circle
                </span>
                {feature.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-text-dark">
            {hebrewName} ({name})
          </h3>
          <p className="text-xs text-text-subtle mt-1">{description}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-text-dark">₪{price}</span>
          <span className="text-xs text-text-subtle block">לחודש</span>
        </div>
      </div>
      <div className="h-px w-full bg-gray-100 my-3" />
      <ul className="space-y-2.5">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-text-subtle">
            <span
              className="material-symbols-outlined text-primary text-[18px] check-icon"
              aria-hidden="true"
            >
              check_circle
            </span>
            {feature.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
