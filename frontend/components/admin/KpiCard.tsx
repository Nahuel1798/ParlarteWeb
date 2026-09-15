interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: string;
  progress: number;
  secondary?: boolean;
  tertiary?: boolean;
}

export default function KpiCard({
  title,
  value,
  change,
  description,
  icon,
  progress,
  secondary,
  tertiary,
}: KpiCardProps) {
  const accent = tertiary
    ? "text-[#735c00]"
    : secondary
      ? "text-[#9d422b]"
      : "text-[#154212]";

  const bar = tertiary
    ? "bg-[#735c00]"
    : secondary
      ? "bg-[#9d422b]"
      : "bg-[#154212]";

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#42493e] uppercase tracking-wider">
          {title}
        </span>

        <div className="w-8 h-8 rounded-full bg-[#f0eee7] flex items-center justify-center">
          <span className={`material-symbols-outlined text-lg ${accent}`}>
            {icon}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline gap-2">
          <span className="font-playfair text-3xl font-bold">
            {value}
          </span>

          <span className={`text-xs font-semibold ${accent}`}>
            {change}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-xs text-[#42493e]">
          <span className={`material-symbols-outlined text-sm ${accent}`}>
            trending_up
          </span>

          {description}
        </div>
      </div>

      <div className="w-full bg-[#ebe8e1] h-1 rounded-full mt-4">
        <div
          className={`${bar} h-1 rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}