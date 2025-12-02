import Link from "next/link";
import { ArrowLeft, Construction, Cog, Hammer } from "lucide-react";
import { Button } from "~/components/ui/button";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  backLink?: string;
  backLabel?: string;
}

export function UnderConstruction({
  title = "Building Something Great",
  description = "This feature is currently under active development. Our engineers are hard at work crafting this module.",
  backLink = "/dashboard",
  backLabel = "Back to Dashboard",
}: UnderConstructionProps) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      {/* Animation Container */}
      <div className="relative mb-8 h-40 w-40">
        {/* Pulsing Background Glow */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />

        {/* Main Gear - Slow Spin */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Cog className="h-32 w-32 animate-[spin_8s_linear_infinite] text-slate-300 opacity-80" />
        </div>

        {/* Small Gear - Reverse Spin */}
        <div className="absolute right-0 bottom-0 flex items-center justify-center">
          <Cog className="h-16 w-16 animate-[spin_6s_linear_infinite_reverse] text-blue-400" />
        </div>

        {/* Hammer Animation (Simple bounce/pulse overlap) */}
        <div className="absolute top-0 -left-2 flex items-center justify-center">
          <Hammer className="h-12 w-12 -rotate-45 animate-bounce text-purple-400" />
        </div>
      </div>

      {/* Text Content */}
      <div className="max-w-md space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-blue-500/20 ring-inset">
          <Construction className="h-3 w-3" />
          <span>Work in Progress</span>
        </div>

        <h1 className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          {title}
        </h1>

        <p className="text-lg text-slate-400">{description}</p>

        <div className="pt-8">
          <Link href={backLink}>
            <Button
              variant="outline"
              className="gap-2 border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
