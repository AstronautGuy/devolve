import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import { ClerkProvider } from "@clerk/nextjs";
import "../styles/globals.css";

import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Header } from "~/components/Header";

export const metadata: Metadata = {
  title: "Devolve CRM",
  description: "Made with ♥️ by TheAstronautGuy",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
        <body>
          <TRPCReactProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
