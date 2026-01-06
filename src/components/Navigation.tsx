"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react"; // Or your preferred icon

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname(); // We use this to trigger a re-check on route change
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if the history stack has more than 1 entry.
    // Length > 1 means the user has navigated at least once.
    if (typeof window !== "undefined" && window.history.length > 1) {
      setCanGoBack(true);
    } else {
      setCanGoBack(false);
    }
  }, [pathname]); // Re-run this check whenever the route changes

  // If we can't go back, return null (render nothing)
  if (!canGoBack) return null;

  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:text-black"
      aria-label="Go back"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200">
        <ArrowLeft className="h-4 w-4" />
      </div>
    </button>
  );
}
