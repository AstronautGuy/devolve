"use client";
import { ThemeToggle } from "~/components/ThemeToggle";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header() {
  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setResolvedTheme(isDark ? "dark" : "light");
    } else if (theme === "dark") setResolvedTheme("dark");
    else setResolvedTheme("light");
  }, [theme]);

  const logoSrc =
    resolvedTheme === "dark" ? "/logo/LogoDark.webp" : "/logo/LogoLight.webp";

  const navItems = [
    { label: "Home", link: "#home" },
    { label: "Work", link: "#work" },
    { label: "Contact", link: "#contact" },
  ];

  return (
    <header
      className="fixed left-1/2 -translate-x-1/2 z-[999] h-20 w-[80%] mt-4
             rounded-2xl flex items-center justify-between px-10
             backdrop-blur-md dark:bg-white/10 bg-black/10
             border dark:border-white/20 border-white/20
             shadow-lg shadow-black/10 transition-all duration-300"
    >
      {/* Logo */}
      <div>
        <Image
          src={logoSrc}
          alt="logo"
          height={50}
          width={50}
          className="transition-all duration-300"
        />
      </div>

      {/* Navigation */}
      <nav className="flex gap-8">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.link}
            className="text-foreground font-medium"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* Theme toggle */}
      <div>
        <ThemeToggle />
      </div>
    </header>
  );
}
