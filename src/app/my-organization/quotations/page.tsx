"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  AlertTriangle,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
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

// --- SCHEMA ---
const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  sku: z.string().optional(),
  category: z.string().optional(),
  // Zod coerce converts string inputs to numbers automatically
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price (e.g., 10.99)"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function QuotationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<ProductFormValues | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search State

  const utils = api.useUtils();

  const { data: products, isLoading } = api.product.getAll.useQuery();

  // Client-side filtering logic
  const filteredProducts = products?.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      (product.sku?.toLowerCase().includes(query) ?? false) ||
      (product.category?.toLowerCase().includes(query) ?? false)
    );
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      quantity: 0,
      price: "0.00",
    },
  });

  // Reset form on open/edit
  useEffect(() => {
    if (editingProduct) {
      form.reset({
        id: editingProduct.id,
        name: editingProduct.name,
        sku: editingProduct.sku ?? "",
        category: editingProduct.category ?? "",
        quantity: editingProduct.quantity,
        price: editingProduct.price,
      });
    } else {
      form.reset({
        name: "",
        sku: "",
        category: "",
        quantity: 0,
        price: "0.00",
      });
    }
  }, [editingProduct, form]);

  // Mutations
  const createMutation = api.product.create.useMutation({
    onSuccess: async () => {
      toast.success("Product Added");
      setIsDialogOpen(false);
      await utils.product.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = api.product.update.useMutation({
    onSuccess: async () => {
      toast.success("Product Updated");
      setIsDialogOpen(false);
      setEditingProduct(null);
      await utils.product.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = api.product.delete.useMutation({
    onSuccess: async () => {
      toast.success("Product Deleted");
      await utils.product.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = (values: ProductFormValues) => {
    if (editingProduct && values.id) {
      updateMutation.mutate({
        ...values,
        id: values.id,
        sku: values.sku ?? undefined,
        category: values.category ?? undefined,
      });
    } else {
      createMutation.mutate({
        ...values,
        sku: values.sku ?? undefined,
        category: values.category ?? undefined,
      });
    }
  };

  const handleEditClick = (
    item: typeof products extends (infer T)[] | undefined ? T : never,
  ) => {
    setEditingProduct({
      id: item.id,
      name: item.name,
      sku: item.sku ?? undefined,
      category: item.category ?? undefined,
      quantity: item.quantity,
      price: item.price,
    });
    setIsDialogOpen(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingProduct(null);
  };

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
              <p className="mt-1 text-slate-500">
                Manage your quotations
              </p>
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
                ) : filteredProducts?.length === 0 ? (
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
                  filteredProducts?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-xs text-slate-400">
                          {item.category}
                        </span>
                        </div>
                      </TableCell>
                      {/* FIX: Use nullish coalescing (??) instead of logical OR (||) */}
                      <TableCell>
                      <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                        {item.sku ?? "N/A"}
                      </span>
                      </TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>
                        {item.quantity < 5 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                          <AlertTriangle className="h-3 w-3" /> Low:{" "}
                            {item.quantity}
                        </span>
                        ) : (
                          <span className="text-slate-600">
                          {item.quantity} units
                        </span>
                        )}
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
                              onClick={() => handleEditClick(item)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                deleteMutation.mutate({ id: item.id })
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
