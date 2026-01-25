"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, isPast } from "date-fns"; // Make sure you have date-fns installed

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
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Bell,
  Calendar,
  Mail,
  Edit,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

// --- 1. ZOD SCHEMA ---
// Matches the input expected by remindersRouter
// --- 1. ZOD SCHEMA ---
const reminderSchema = z.object({
  id: z.string().optional(),

  client_name: z.string().min(1, "Client name is required"),
  client_email: z.string().email("Invalid email address"),
  product_name: z.string().min(1, "Product name is required"),
  phone: z.string().optional(),

  // Use coerce here so the HTML date input string is converted to a Date object
  date: z.coerce.date({ required_error: "Date is required" }),

  // 👇 FIX: Remove .default("pending").
  // We handle the default in useForm() below.
  status: z.enum(["pending", "completed", "cancelled"]),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

// --- 2. HELPER FUNCTIONS ---
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "completed":
      return "bg-green-50 text-green-700 ring-green-600/20";
    case "cancelled":
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
};

export default function RemindersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] =
    useState<ReminderFormValues | null>(null);

  const utils = api.useUtils();

  // 1. Fetch Data
  const { data: reminders, isLoading } = api.reminders.getAll.useQuery();

  // 2. Client-side Search
  const filteredReminders = reminders?.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.client_name.toLowerCase().includes(query) ||
      item.product_name.toLowerCase().includes(query) ||
      item.client_email.toLowerCase().includes(query)
    );
  });

  // 3. Form Setup
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      client_name: "",
      client_email: "",
      product_name: "",
      phone: "",
      status: "pending",
      // Date default is undefined initially
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (editingReminder) {
      form.reset({
        ...editingReminder,
        // Ensure date is formatted for input if needed, or passed as object
        date: editingReminder.date,
      });
    } else {
      form.reset({
        client_name: "",
        client_email: "",
        product_name: "",
        phone: "",
        status: "pending",
        date: new Date(), // Default to today
      });
    }
  }, [editingReminder, form]);

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingReminder(null);
  };

  // 4. Mutations
  const createMutation = api.reminders.create.useMutation({
    onSuccess: async () => {
      toast.success("Reminder Scheduled");
      setIsDialogOpen(false);
      await utils.reminders.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = api.reminders.update.useMutation({
    onSuccess: async () => {
      toast.success("Reminder Updated");
      setIsDialogOpen(false);
      setEditingReminder(null);
      await utils.reminders.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = api.reminders.delete.useMutation({
    onSuccess: async () => {
      toast.success("Reminder Deleted");
      await utils.reminders.getAll.invalidate();
    },
  });

  const onSubmit = (values: ReminderFormValues) => {
    if (editingReminder && values.id) {
      updateMutation.mutate({ ...values, id: values.id });
    } else {
      createMutation.mutate(values);
    }
  };

  type DatabaseRow = {
    id: string;
    client_name: string;
    client_email: string;
    product_name: string;
    status: string;
    phone: string | null;
    start_date: Date | null;
    end_date: Date | null;
  };

  const handleEdit = (row: unknown) => {
    // Cast strict type
    const data = row as DatabaseRow;

    // Convert DB shape -> Form shape
    const formValues: ReminderFormValues = {
      id: data.id,
      client_name: data.client_name,
      client_email: data.client_email,
      product_name: data.product_name,
      phone: data.phone ?? "", // Handle null phone

      // THE FIX: Map 'start_date' to 'date'.
      // If start_date is null, default to new Date()
      date: data.start_date ? new Date(data.start_date) : new Date(),

      // Force status to match the specific strings allowed in the form
      status:
        (data.status as "pending" | "completed" | "cancelled") || "pending",
    };

    setEditingReminder(formValues);
    setIsDialogOpen(true);
  };

  return (
        <main className="space-y-6 p-6">
          <section className={"flex flex-row gap-6"}>
            <SidebarTrigger />
            <Navigation
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "My Organization", href: "/my-organization" },
                { label: "Reminders" },
              ]}
            />
          </section>

          {/* HEADER */}
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
              <p className="mt-1 text-slate-500">
                Automated client notifications and renewals.
              </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button className="hover:bg-slate-800">
                  <Plus className="mr-2 h-4 w-4" /> Schedule Reminder
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingReminder ? "Edit Reminder" : "Schedule Reminder"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingReminder
                      ? "Update the details for this notification."
                      : "Set a date for an automated email to your client."}
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 py-4"
                  >
                    {/* Client Details Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="client_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="client_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Email</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="client@email.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="product_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product / Service</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Annual Maintenance Contract"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Date and Status Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                              <Input
                                type="datetime-local"
                                placeholder="Select date"
                                {...field}
                                value={
                                  field.value
                                    ? new Date(field.value)
                                        .toISOString()
                                        .slice(0, 16)
                                    : ""
                                }
                                onChange={(e) =>
                                  field.onChange(new Date(e.target.value))
                                }
                              />
                            </FormControl>
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
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
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
                              placeholder="+91..."
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
                          : editingReminder
                            ? "Update Reminder"
                            : "Set Reminder"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* SEARCH */}
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search clients or products..."
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
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Reminder For</TableHead>
                  <TableHead>Due Date</TableHead>
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
                        Loading reminders...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredReminders?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-slate-500"
                    >
                      No reminders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReminders?.map((reminder) => {

                    return (
                      <TableRow
                        key={reminder.id}
                        className="hover:bg-slate-50/50"
                      >
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{reminder.client_name}</span>
                            <span className="flex items-center gap-1 text-xs font-normal text-slate-500">
                              <Mail className="h-3 w-3" />{" "}
                              {reminder.client_email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Bell className="h-3 w-3 text-slate-400" />
                            {reminder.product_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(reminder.start_date), "PPP")}
                            </div>
                            <div className="mt-1 flex items-center gap-1 text-xs opacity-80">
                              <Clock className="h-3 w-3" />
                              {format(new Date(reminder.start_date), "p")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(reminder.status)}`}
                          >
                            {reminder.status === "completed" && (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            )}
                            {reminder.status.charAt(0).toUpperCase() +
                              reminder.status.slice(1)}
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
                                onClick={() => handleEdit(reminder)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  deleteMutation.mutate({ id: reminder.id })
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </main>
  );
}
