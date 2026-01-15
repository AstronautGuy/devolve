"use client";

import { useUser, useOrganization } from "@clerk/nextjs";
import {
  ShoppingCart,
  ShoppingBag,
  Calculator,
  Users,
  GalleryVerticalEnd,
} from "lucide-react";

// You can place this logic inside your AppSidebar component
export function useSidebarData() {
  const { user } = useUser();
  const { organization } = useOrganization();

  // Construct the data object dynamically
  const data = {
    user: {
      name: user?.fullName ?? "User",
      email: user?.primaryEmailAddress?.emailAddress ?? "",
      avatar: user?.imageUrl ?? "",
    },
    teams: organization
      ? [
          {
            name: organization?.name ?? "",
            logo: GalleryVerticalEnd,
            plan: "Active",
            id: organization?.id ?? "",
          },
        ]
      : [],
    // Mapping Clerk Organizations to the 'teams' format
    navMain: [
      {
        title: "Sales",
        url: "/sales",
        icon: ShoppingCart,
        isActive: true,
        items: [
          {
            title: "Clients & Prospects",
            url: "/sales/clients",
          },
          {
            title: "Quotations & Estimates",
            url: "/sales/quotations",
          },
          {
            title: "Proforma Invoices",
            url: "/sales/proforma",
          },
          {
            title: "Invoices",
            url: "/sales/invoices",
          },
          {
            title: "Payment Receipts",
            url: "/sales/receipts",
          },
          {
            title: "Sales Orders",
            url: "/sales/orders",
          },
          {
            title: "Delivery Challans",
            url: "/sales/delivery",
          },
          {
            title: "Credit Notes",
            url: "/sales/credit-notes",
          },
        ],
      },
      {
        title: "Purchases",
        url: "/purchases",
        icon: ShoppingBag,
        items: [
          {
            title: "Vendors Leads",
            url: "/purchases/leads",
          },
          {
            title: "Vendors & Suppliers",
            url: "/purchases/vendors",
          },
          {
            title: "Purchases & Expenses",
            url: "/purchases/expenses",
          },
          {
            title: "Purchase Orders",
            url: "/purchases/orders",
          },
          {
            title: "Payout Receipts",
            url: "/purchases/payouts",
          },
          {
            title: "Debit Notes",
            url: "/purchases/debit-notes",
          },
          {
            title: "Hire The Best Vendors",
            url: "/purchases/hire",
          },
        ],
      },
      {
        title: "Accounting",
        url: "/accounting",
        icon: Calculator,
        items: [
          {
            title: "Account Groups",
            url: "/accounting/groups",
          },
          {
            title: "Chart of Accounts",
            url: "/accounting/chart",
          },
          {
            title: "Voucher Books",
            url: "/accounting/vouchers",
          },
          {
            title: "Balance Sheet",
            url: "/accounting/balance-sheet",
          },
          {
            title: "Trial Balance",
            url: "/accounting/trial-balance",
          },
          {
            title: "Profit and Loss",
            url: "/accounting/pnl",
          },
          {
            title: "Income Statement",
            url: "/accounting/income",
          },
          {
            title: "Day Book",
            url: "/accounting/day-book",
          },
          {
            title: "Cash Flow Statement",
            url: "/accounting/cash-flow",
          },
        ],
      },
      {
        title: "Sales CRM",
        url: "/crm",
        icon: Users,
        items: [
          {
            title: "All Pipelines",
            url: "/crm/pipelines",
          },
          {
            title: "Forms",
            url: "/crm/forms",
          },
          {
            title: "All Leads",
            url: "/crm/leads",
          },
          {
            title: "Leads Summary",
            url: "/crm/summary",
          },
          {
            title: "Team Sales Report",
            url: "/crm/reports/team",
          },
          {
            title: "Client Performance Report",
            url: "/crm/reports/client",
          },
          {
            title: "Lead Source Report",
            url: "/crm/reports/source",
          },
        ],
      },
    ],
  };
  return data;
}
