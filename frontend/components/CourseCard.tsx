import Link from "next/link";

interface CourseCardProps {
  title: string;
  level: string;
  description: string;
  image: string;
  href?: string;
  large?: boolean;
}

export default function CourseCard({
  title,
  level,
  description,
  image,
  href = "#",
  large = false,
}: CourseCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-primary/15 bg-white transition-all duration-300 hover:shadow-[0_20px_40px_rgba(21,66,18,0.08)] ${
        large ? "md:col-span-2" : ""
      }`}
    >
      <div className="h-48 overflow-hidden relative">
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{
            backgroundImage: `url('${image}')`,
          }}
        />

        <div className="absolute top-4 right-4 bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded text-xs font-semibold">
          {level}
        </div>
      </div>

      <div className="p-6 flex flex-col h-full">
        <h3 className="font-headline-md text-2xl text-primary mb-2">
          {title}
        </h3>

        <p className="font-body-md text-base text-on-surface-variant mb-6">
          {description}
        </p>

        <Link
          href={href}
          className="inline-flex items-center text-secondary font-semibold text-sm hover:text-secondary-container transition-colors"
        >
          Explore Syllabus

          <span className="material-symbols-outlined ml-1 text-[16px]">
            chevron_right
          </span>
        </Link>
      </div>
    </div>
  );
}