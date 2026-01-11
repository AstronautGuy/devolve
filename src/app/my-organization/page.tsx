"use client";

import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Users,
  FileText,
  Briefcase,
  Package,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { ModuleCard } from "~/components/ModuleCard";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset, // 1. Add this import
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/Sidebar";
import { Navigation } from "~/components/Navigation";

export default function DashboardPage() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const { has, isLoaded: authLoaded } = useAuth();

  // Wait for auth to load
  if (!authLoaded || !orgLoaded || !userLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#15162c] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    );
  }

  if (!user) return <div className="p-10 text-white">No User found.</div>;
  if (!organization)
    return (
      <div className="p-10 text-white">
        No organization found. Create one in Clerk.
      </div>
    );

  const isAdmin = has({ role: "org:admin" });

  const modules = [
    {
      title: "Quotations",
      description: "Propose and Approve quotations for clients",
      href: "/my-organization/quotations",
      icon: Users,
      color: "bg-yellow-500/20 text-yellow-300",
      border: "hover:border-yellow-500/50",
    },
    {
      title: "Staff Management",
      description: "Manage employees, roles, and permissions.",
      href: "/my-organization/staff",
      icon: Users,
      color: "bg-blue-500/20 text-blue-300",
      border: "hover:border-blue-500/50",
    },
    {
      title: "Invoices",
      description: "Create, track, and send invoices to clients.",
      href: "/my-organization/invoices",
      icon: FileText,
      color: "bg-green-500/20 text-green-300",
      border: "hover:border-green-500/50",
    },
    {
      title: "Clients (CRM)",
      description: "Manage leads and customer relationships.",
      href: "/my-organization/clients",
      icon: Briefcase,
      color: "bg-purple-500/20 text-purple-300",
      border: "hover:border-purple-500/50",
    },
    {
      title: "Inventory",
      description: "Track products, stock levels, and SKUs.",
      href: "/my-organization/inventory",
      icon: Package,
      color: "bg-orange-500/20 text-orange-300",
      border: "hover:border-orange-500/50",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="flex min-h-screen flex-col space-y-6 p-6">
          <section className={"flex flex-row gap-6"}>
            <SidebarTrigger />
            <Navigation
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "My Organization" },
              ]}
            />
          </section>
          {/* --- HEADER SECTION --- */}
          <div className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-start md:justify-between">
            {/* Left: Org Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={organization.imageUrl}
                  alt={organization.name}
                  className="h-20 w-20 rounded-2xl border-2 border-white/10 object-cover shadow-2xl"
                />
                {isAdmin && (
                  <span className="absolute -right-2 -bottom-2 rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-black shadow-lg">
                    ADMIN
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-lg font-medium text-gray-400">
                  {organization.name}
                </h1>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Hello, {user.firstName}
                </h2>
              </div>
            </div>

            {/* Right: Actions */}
            {isAdmin && (
              <Link
                href="/my-organization/manage"
                className="group flex items-center gap-3 rounded-xl bg-purple-800 px-5 py-3 font-medium text-white backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
              >
                <Settings className="h-5 w-5 transition-transform group-hover:rotate-90" />
                <span>Manage Organization</span>
              </Link>
            )}
          </div>

          {/* --- MODULES GRID --- */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {modules.map((item) => (
              <ModuleCard
                key={item.title}
                title={item.title}
                description={item.description}
                href={item.href}
                icon={item.icon}
                iconColorClass={item.color}
                hoverBorderClass={item.border}
              />
            ))}

            {/* Admin Only Extra Card (Audit Logs, etc) */}
            {isAdmin && (
              <ModuleCard
                title="Security Center"
                description="View audit logs, manage API keys, and system alerts."
                href="/my-organization/security"
                icon={ShieldAlert}
                // Override styles for the Security Card
                iconColorClass="bg-red-500/20 text-red-400"
                hoverBorderClass="hover:border-red-500/40"
                className="border-red-500/20 bg-red-500/5 hover:bg-red-500/10"
              />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}