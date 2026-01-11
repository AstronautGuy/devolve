"use client";

import * as React from "react";

import { SidebarNav } from "~/components/SidebarNav";
import { NavUser } from "~/components/NavUser";
import { CompanySwitcher } from "~/components/CompanySwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import { useSidebarData } from "~/components/SidebarData";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const data = useSidebarData();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CompanySwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}