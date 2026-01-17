import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import { ClerkProvider } from "@clerk/nextjs";
import "../../styles/globals.css";

import { Toaster } from "~/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/Sidebar";
import { Navigation } from "~/components/Navigation";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function OrgLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable}`}>
        <body>
          <TRPCReactProvider>
            <SidebarProvider>
              <AppSidebar/>
              <SidebarInset>
                  <section className={"flex flex-row gap-6"}>
                    <SidebarTrigger />
                    <Navigation
                      breadcrumbs={[
                        { label: "Home", href: "/" },
                        { label: "My Organization", href: "/my-organization" },
                        { label: "Clients" },
                      ]}
                    />
                  </section>
              {children}
              </SidebarInset>
            </SidebarProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
