"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  X,
} from "lucide-react";

// UI Components
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Navigation } from "~/components/Navigation";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/Sidebar";
import Link from "next/link";


const getStatusColor = (status: string) => {
  switch (status) {
    case "Draft":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "Sent":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "Approved":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "Rejected":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
};

export default function QuotationsPage() {
  const [searchQuery, setSearchQuery] = useState(""); // Search State

  const utils = api.useUtils();

  const { data: quotations, isLoading } = api.quotation.getAll.useQuery();

  // Client-side filtering logic
  const filteredQuotations = quotations?.filter((quotation) => {
    const query = searchQuery.toLowerCase();
    return (
      quotation.quotationNumber.includes(query) ||
      quotation.quotationFrom.toLowerCase().includes(query) ||
      quotation.quotationTo.toLowerCase().includes(query)
    );
  });

  const deleteMutation = api.quotation.delete.useMutation({
    onSuccess: async () => {
      toast.success("Quotation Deleted");
      await utils.quotation.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="space-y-6 p-6">
          <section className={"flex flex-row gap-6"}>
            <SidebarTrigger />
            <Navigation
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "My Organization", href: "/my-organization" },
                { label: "Quotations" },
              ]}
            />
          </section>
          {/* HEADER */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Quotations</h1>
              <p className="mt-1 text-slate-500">Manage your quotations</p>
            </div>

            <Link href="/my-organization/quotations/new">
              <Button className="hover:bg-slate-800">
                <Plus className="mr-2 h-4 w-4" /> Create new quotation
              </Button>
            </Link>
          </div>

          {/* SEARCH BAR */}
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search among your quotations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8 pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* TABLE */}
          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead>Quotation ID</TableHead>
                  <TableHead>Quoted To</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-slate-500"
                    >
                      Loading your quotations...
                    </TableCell>
                  </TableRow>
                ) : filteredQuotations?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-slate-500"
                    >
                      {searchQuery
                        ? "No matching quotations found."
                        : "No quotations added yet."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuotations?.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{quotation.quotationNumber}</span>
                        </div>
                      </TableCell>
                      {/* FIX: Use nullish coalescing (??) instead of logical OR (||) */}
                      <TableCell>
                        <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                          {quotation.quotationTo}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                          {quotation.quotationFrom}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(quotation.quotationStatus ?? "Active")}`}
                        >
                          {quotation.quotationStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                deleteMutation.mutate({ id: quotation.id })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
