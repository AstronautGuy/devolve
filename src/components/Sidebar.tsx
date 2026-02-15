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
  useSidebar, // <--- Import this hook
} from "~/components/ui/sidebar";
import { useSidebarData } from "~/components/SidebarData";
import { OrganizationSwitcher } from "@clerk/nextjs";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { navMain, user, isLoading } = useSidebarData();
  const { state } = useSidebar(); // <--- Get current sidebar state

  if (isLoading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
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
        {state === "collapsed" ? (
          // COLLAPSED STATE: Show only the Org Logo (Icon)
          <div className="flex w-full items-center justify-center py-2">
            <OrganizationSwitcher
              hidePersonal={true}
              appearance={{
                elements: {
                  rootBox: "flex justify-center items-center w-full",
                  organizationSwitcherTrigger:
                    "p-0 w-8 h-8 flex justify-center", // Force square icon
                  organizationPreviewMainIdentifier: "hidden", // Hide Text
                  organizationPreviewSecondaryIdentifier: "hidden", // Hide Text
                  organizationSwitcherTriggerIcon: "hidden", // Hide Chevron
                },
              }}
            />
          </div>
        ) : (
          // EXPANDED STATE: Show Full Switcher with your theme styles
          <OrganizationSwitcher
            hidePersonal={true}
            appearance={{
              elements: {
                rootBox: "flex w-full",
                organizationSwitcherTrigger:
                  "flex w-full items-center justify-between rounded-md p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:bg-sidebar-accent focus:text-sidebar-accent-foreground",
                organizationPreviewMainIdentifier:
                  "text-sidebar-foreground font-medium",
                organizationPreviewSecondaryIdentifier:
                  "text-sidebar-foreground/60 text-xs",
                organizationSwitcherTriggerIcon: "text-sidebar-foreground/50",
              },
            }}
          />
        )}
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
