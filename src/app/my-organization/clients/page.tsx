"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Plus, Search, MoreVertical, Trash2, X } from "lucide-react";

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
    case "Active":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "Inactive":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
};

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState(""); // Search State

  const utils = api.useUtils();

  const { data: clients, isLoading } = api.clients.getAll.useQuery();

  // Client-side filtering logic
  const filteredClients = clients?.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.includes(query) ??
      client.industry?.toLowerCase().includes(query) ??
      client.status?.toLowerCase().includes(query)
    );
  });

  const deleteMutation = api.clients.delete.useMutation({
    onSuccess: async () => {
      toast.success("Client Deleted");
      await utils.clients.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <main className="space-y-6 p-6">
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
      {/* HEADER */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="mt-1 text-slate-500">Manage your Clients</p>
        </div>

        <Link href="/my-organization/clients/new">
          <Button className="hover:scale-105">
            <Plus className="mr-2 h-4 w-4" /> Create new client
          </Button>
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search among your clients..."
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
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading your clients...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredClients?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-slate-500"
                >
                  {searchQuery
                    ? "No matching clients found."
                    : "No clients added yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredClients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{client.name}</span>
                    </div>
                  </TableCell>
                  {/* FIX: Use nullish coalescing (??) instead of logical OR (||) */}
                  <TableCell>
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                      {client.industry ?? "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                      {client.type === "Individual"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(client.status ?? "Active")}`}
                    >
                      {client.status}
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
                            deleteMutation.mutate({ id: client.id })
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
    </main>
  );
}
