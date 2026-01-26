"use client";

import * as React from "react";

import { SidebarNav } from "~/components/SidebarNav";
import { NavUser } from "~/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { useSidebarData } from "~/components/SidebarData";
import { OrganizationSwitcher } from "@clerk/nextjs";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // 1. Destructure isLoading if your hook exposes it (recommended)
  // OR check if data.teams is missing
  const { teams, navMain, user, isLoading } = useSidebarData();

  // 2. Prevent rendering empty headers during fetch
  // You can also return a Skeleton here if you prefer
  if (isLoading || !teams) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          {/* Render a skeleton or empty div to prevent layout shift */}
          <div className="bg-sidebar-accent/50 h-12 w-full animate-pulse rounded-md" />
        </SidebarHeader>
        <SidebarContent />
        <SidebarFooter />
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}