
interface BenefitProps {
  text: string;
}

export default function Benefit({ text }: BenefitProps) {
  return (
    <div className="flex items-start space-x-2">

      <div className="w-5 h-5 rounded-full bg-[#cca730]/30 text-[#e2c257] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
        ✓
      </div>

      <p className="text-xs text-[#a1d494]/90 leading-relaxed">
        {text}
      </p>

    </div>
  );
}

