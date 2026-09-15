interface AvatarProps {
  initials: string;
  tone?: "primary" | "secondary" | "tertiary";
  className?: string;
}

const bgClass = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

export default function Avatar({
  initials,
  tone = "primary",
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${bgClass[tone]} ${className}`}
    >
      {initials}
    </div>
  );
}