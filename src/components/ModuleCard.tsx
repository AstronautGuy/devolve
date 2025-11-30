import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Class for the icon's background and text color (e.g. "bg-blue-500/20 text-blue-300") */
  iconColorClass: string;
  /** Class for the hover border effect (e.g. "hover:border-blue-500/50") */
  hoverBorderClass?: string;
  /** Optional overrides for the main container (e.g. for the red Security card) */
  className?: string;
}

export function ModuleCard({
                             title,
                             description,
                             href,
                             icon: Icon,
                             iconColorClass,
                             hoverBorderClass = "",
                             // Default dark theme styles, can be overridden
                             className = "border-white/5 bg-white/5 hover:bg-white/10",
                           }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${className} ${hoverBorderClass}`}
    >
      <div>
        <div className={`mb-4 inline-flex rounded-xl p-3 ${iconColorClass}`}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-white group-hover:text-white/90">
          {title}
        </h3>
        <p className="text-sm text-gray-400 group-hover:text-gray-300">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center text-sm font-medium text-white/50 transition-colors group-hover:text-white">
        Open {title}{" "}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}