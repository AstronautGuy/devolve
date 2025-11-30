"use client";

import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Users,
  FileText,
  Briefcase,
  Package,
  Settings,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

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

  if (!user) return <div className="text-white p-10">No User found.</div>;
  if (!organization) return <div className="text-white p-10">No organization found. Create one in Clerk.</div>;

  const isAdmin = has({ role: "org:admin" });

  // Module Definitions
  const modules = [
    {
      title: "Staff Management",
      description: "Manage employees, roles, and permissions.",
      href: "/dashboard/staff",
      icon: Users,
      color: "bg-blue-500/20 text-blue-300",
      border: "hover:border-blue-500/50",
    },
    {
      title: "Invoices",
      description: "Create, track, and send invoices to clients.",
      href: "/dashboard/invoices",
      icon: FileText,
      color: "bg-green-500/20 text-green-300",
      border: "hover:border-green-500/50",
    },
    {
      title: "Clients (CRM)",
      description: "Manage leads and customer relationships.",
      href: "/dashboard/clients",
      icon: Briefcase,
      color: "bg-purple-500/20 text-purple-300",
      border: "hover:border-purple-500/50",
    },
    {
      title: "Inventory",
      description: "Track products, stock levels, and SKUs.",
      href: "/dashboard/inventory",
      icon: Package,
      color: "bg-orange-500/20 text-orange-300",
      border: "hover:border-orange-500/50",
    },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4 md:p-8 text-white">

      {/* --- HEADER SECTION --- */}
      <div className="mb-12 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-start md:justify-between">
        {/* Left: Org Info */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={organization.imageUrl}
              alt={organization.name}
              className="h-20 w-20 rounded-2xl object-cover shadow-2xl border-2 border-white/10"
            />
            {isAdmin && (
              <span className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                ADMIN
              </span>
            )}
          </div>
          <div>
            <h1 className="text-lg font-medium text-gray-400">{organization.name}</h1>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Hello, {user.firstName}
            </h2>
          </div>
        </div>

        {/* Right: Actions */}
        {isAdmin && (
          <Link
            href="/dashboard/settings"
            className="group flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 font-medium transition-all hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <Settings className="h-5 w-5 transition-transform group-hover:rotate-90" />
            <span>Manage Organization</span>
          </Link>
        )}

      </div>
      <h1 className={"font-light opacity-75 italic"}>all cards visible to all users as manage access is yet under development</h1>
      {/* --- MODULES GRID --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {modules.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl hover:-translate-y-1 ${item.border}`}
          >
            <div>
              <div className={`mb-4 inline-flex rounded-xl p-3 ${item.color}`}>
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white group-hover:text-white/90">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300">
                {item.description}
              </p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-white/50 transition-colors group-hover:text-white">
              Open Module <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}

        {/* Admin Only Extra Card (Audit Logs, etc) */}
        {isAdmin && (
          <Link
            href="/dashboard/security"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-red-500/20 bg-red-500/5 p-6 transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/40 hover:-translate-y-1"
          >
            <div>
              <div className="mb-4 inline-flex rounded-xl p-3 bg-red-500/20 text-red-400">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-red-100">Security Center</h3>
              <p className="text-sm text-red-200/60">
                View audit logs, manage API keys, and system alerts.
              </p>
            </div>
          </Link>
        )}
      </div>

    </main>
  );
}