"use client";

import * as React from "react";
import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";

export function ThemeToggle() {
  const { theme: activeTheme, setTheme } = useTheme();
  const theme = activeTheme || "system"; // ✅ fallback to system if undefined

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={cycleTheme}
      className="relative transition-all"
    >
      {/* Light */}
      <Sun className="h-[1.2rem] w-[1.2rem] transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />

      {/* Dark */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0" />

      {/* System */}
      <Globe
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
          theme === "system" ? "scale-100 rotate-0" : "scale-0 rotate-90"
        }`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
