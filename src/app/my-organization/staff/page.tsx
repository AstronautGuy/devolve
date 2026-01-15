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
  Mail,
  Phone,
  Shield,
  Edit,
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
  DialogDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { AppSidebar } from "~/components/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Navigation } from "~/components/Navigation";

// --- 1. DEFINE CONSTANTS FOR TYPE SAFETY ---
const ROLES = ["Admin", "Manager", "Employee"] as const;
const STATUSES = ["Active", "Inactive", "On Leave", "Terminated"] as const;

const indianPhoneRegex = /^(?:\+91[\s-]?|0)?[6-9]\d{9}$/;

// --- 2. ZOD SCHEMA ---
const staffSchema = z.object({
  id: z.string().optional(),

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .regex(/^[A-Za-z\s'.-]+$/, "Name contains invalid characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(100, "Email is too long"),

  role: z.enum(ROLES, {
    required_error: "Role is required",
  }),

  phone: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? val.replace(/[\s-]/g, "") : val))
    .refine(
      (val) => !val || indianPhoneRegex.test(val),
      "Enter a valid Indian mobile number",
    ),

  // FIX: Removed .default("Active") here to align Input/Output types for RHF
  // We will handle the default value in useForm instead.
  status: z.enum(STATUSES),
});

// Infer Type
type StaffFormValues = z.infer<typeof staffSchema>;

// Helper for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "Inactive":
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
    case "On Leave":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "Terminated":
      return "bg-red-50 text-red-700 ring-red-600/20";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
};

export default function StaffPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffFormValues | null>(
    null,
  );

  const utils = api.useUtils();

  // 1. Fetch Staff Data
  const { data: staffList, isLoading } = api.staff.getAll.useQuery();

  // 2. Setup Form with Explicit Type
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Employee",
      phone: "",
      status: "Active", // Default handled here now
    },
  });

  // Reset form when dialog opens/closes or editing state changes
  useEffect(() => {
    if (editingStaff) {
      form.reset({
        id: editingStaff.id,
        name: editingStaff.name,
        email: editingStaff.email,
        role: editingStaff.role,
        phone: editingStaff.phone ?? "",
        status: editingStaff.status,
      });
    } else {
      form.reset({
        name: "",
        email: "",
        role: "Employee",
        phone: "",
        status: "Active",
      });
    }
  }, [editingStaff, form]);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingStaff(null);
  };

  // 3. Create Mutation
  const createMutation = api.staff.create.useMutation({
    onSuccess: async () => {
      toast.success("Staff Member Added");
      setIsDialogOpen(false);
      await utils.staff.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  // 4. Update Mutation
  const updateMutation = api.staff.update.useMutation({
    onSuccess: async () => {
      toast.success("Staff Member Updated");
      setIsDialogOpen(false);
      setEditingStaff(null);
      await utils.staff.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  // 5. Delete Mutation
  const deleteMutation = api.staff.delete.useMutation({
    onSuccess: async () => {
      toast.success("Staff Removed");
      await utils.staff.getAll.invalidate();
    },
  });

  const onSubmit = (values: StaffFormValues) => {
    if (editingStaff && values.id) {
      updateMutation.mutate({
        ...values,
        id: values.id,
        phone: values.phone ?? undefined,
      });
    } else {
      createMutation.mutate({
        ...values,
        phone: values.phone ?? undefined,
      });
    }
  };

  const handleEdit = (staff: StaffFormValues) => {
    setEditingStaff(staff);
    setIsDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="space-y-6 p-6">
          <section className={"flex flex-row gap-6"}>
            <SidebarTrigger />
            <Navigation
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "My Organization", href: "/my-organization" },
                { label: "Inventory" },
              ]}
            />
          </section>
          {/* HEADER */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Staff Management
              </h1>
              <p className="mt-1 text-slate-500">
                Manage your team members and permissions.
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button className="hover:bg-slate-800">
                  <Plus className="mr-2 h-4 w-4" /> Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingStaff ? "Edit Team Member" : "Add New Team Member"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingStaff
                      ? "Update details for this employee."
                      : "Send an invite to a new employee."}
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 py-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Employee">
                                  Employee
                                </SelectItem>
                                <SelectItem value="Manager">Manager</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">
                                  Inactive
                                </SelectItem>
                                <SelectItem value="On Leave">
                                  On Leave
                                </SelectItem>
                                <SelectItem value="Terminated">
                                  Terminated
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+1 234..."
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={
                          createMutation.isPending || updateMutation.isPending
                        }
                      >
                        {createMutation.isPending || updateMutation.isPending
                          ? "Saving..."
                          : editingStaff
                            ? "Update Member"
                            : "Add Member"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* SEARCH & FILTER */}
          <div className="flex w-fit items-center space-x-2 rounded-lg border p-2">
            <Search className="h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search employees..."
              className="h-8 w-64 border-none focus-visible:ring-0"
            />
          </div>

          {/* DATA TABLE */}
          <div className="rounded-md border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="">
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
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
                        Loading team...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : staffList?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-slate-500"
                    >
                      No staff members found. Add your first employee!
                    </TableCell>
                  </TableRow>
                ) : (
                  staffList?.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                            {staff.name.substring(0, 2).toUpperCase()}
                          </div>
                          {staff.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            staff.role === "Admin"
                              ? "default"
                              : staff.role === "Manager"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {staff.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {staff.email}
                          </div>
                          {staff.phone && (
                            <div className="mt-0.5 flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {staff.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(staff.status ?? "Active")}`}
                        >
                          {staff.status ?? "Active"}
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
                            {/* Safe Cast: We know the shape matches */}
                            <DropdownMenuItem
                              onClick={() =>
                                handleEdit(staff as unknown as StaffFormValues)
                              }
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-500">
                              <Shield className="mr-2 h-4 w-4" /> Manage Access
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() =>
                                deleteMutation.mutate({ id: staff.id })
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Remove User
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
      </SidebarInset>
    </SidebarProvider>
  );
}
