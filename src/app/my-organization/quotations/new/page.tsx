"use client";

import { z } from "zod";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

// UI imports
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/Sidebar";
import { Navigation } from "~/components/Navigation";
import { InlineEdit } from "~/components/InlineEdit";
import { Select, SelectTrigger } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "~/components/ui/select";
import { ChevronDownIcon, PencilIcon, Save, Loader2 } from "lucide-react"; // Added Icons
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useEffect } from "react"; // Assuming you have a Button component

import { incrementInvoiceNumber } from "~/lib/utils";
import { DatePicker } from "~/components/DatePicker";
import { format } from "date-fns";

// 1. Adjusted Schema to accept strings for dates (since you use text inputs like "Today")
const quotationSchema = z.object({
  id: z.string().optional(),
  number: z.string(),
  title: z.string(),
  subTitle: z.string(),
  date: z.string().optional(), // Changed from z.date() to z.string() for text input support
  dueDate: z.string().optional(), // Changed from z.date() to z.string()
  from: z.string(),
  to: z.string(),
  status: z
    .enum(["Draft", "Sent", "Approved", "Rejected"])
    .default("Draft")
    .optional(),
});

type QuotationFormValues = z.infer<typeof quotationSchema>;

export default function NewQuotationPage() {
  const router = useRouter();
  const utils = api.useUtils();

  // 2. Destructure setValue and handleSubmit, and watch to sync UI
  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      number: "001",
      title: "Quotation",
      subTitle: "Quotation Subtitle", // Fixed default to match UI
      from: "Devolve Studio",
      to: "Dev Infotech", // Fixed to match UI logic
      date: "",
      dueDate: "",
      status: "Draft",
    },
  });

  const { setValue, handleSubmit, watch, reset, getValues } = form;
  const values = watch(); // Watch values to display current state in UI if needed

  const createMutation = api.quotations.create.useMutation({
    onSuccess: async () => {
      toast.success("Quotation Created Successfully");
      await utils.quotations.getAll.invalidate();
      router.push("/my-organization/quotations");

      await Promise.all([
        utils.quotations.getAll.invalidate(),
        utils.settings.get.invalidate(),
      ]);
    },
    onError: (err) => toast.error(err.message),
  });

  const settingsMutation = api.settings.update.useMutation();

  const { data: settings, isLoading: isSettingsLoading } =
    api.settings.get.useQuery();

  useEffect(() => {
    // Only run if we have settings and aren't loading
    if (settings && !isSettingsLoading) {
      // A. Calculate next number
      // Ensure we handle potential null/undefined safely

      // B. Update Form
      // FIX: Use 'getValues()' to get current data, not 'setValue()'
      // FIX: Remove 'values' from the dependency array to avoid infinite loops
      reset({
        ...getValues(),
        number: settings.nextQuotationNumber ?? "000",
      });
    }
    // Dependencies: Only re-run if settings change or loading finishes.
    // DO NOT include 'values' or 'getValues' here.
  }, [settings, isSettingsLoading, reset, getValues]);

  const onSubmit = (values: QuotationFormValues) => {
    // Helper function to parse your UI strings into Dates
    const parseDateString = (dateStr?: string) => {
      if (!dateStr) return undefined;
      if (dateStr === "Today") return new Date();
      if (dateStr === "T+14") {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date;
      }
      // Try parsing standard date string, fallback to undefined if invalid
      const parsed = new Date(dateStr);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    };

    // Create the payload matching the Server Schema (Date objects)
    const submissionData = {
      ...values,
      date: parseDateString(values.date),
      dueDate: parseDateString(values.dueDate),
    };

    // Now .mutate will receive the correct Date types
    createMutation.mutate(submissionData);

    const nextNumber = incrementInvoiceNumber(submissionData.number);
    const settingsUpdate = {
      nextQuotationNumber: nextNumber,
    };
    settingsMutation.mutate(settingsUpdate);
  };

  // Helper to handle InlineEdit saves cleanly
  const handleFieldChange = (
    field: keyof QuotationFormValues,
    value: string,
  ) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
    toast.info(`Updated ${field}`); // Optional: Feedback
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="space-y-6 p-6">
          <section
            className={"flex flex-row items-center justify-between gap-6"}
          >
            <div className="flex flex-row gap-6">
              <SidebarTrigger />
              <Navigation
                breadcrumbs={[
                  { label: "Home", href: "/" },
                  { label: "My Organization", href: "/my-organization" },
                  { label: "Quotations", href: "/my-organization/quotations" },
                  { label: "New Quotation" },
                ]}
              />
            </div>
            {/* 3. Added Save Button */}
            <div className="flex gap-2">
              {/*<Button*/}
              {/*  onClick={handleSubmit(onSubmit)}*/}
              {/*  disabled={createMutation.isPending}*/}
              {/*>*/}
              {/*  {createMutation.isPending ? (*/}
              {/*    <Loader2 className="mr-2 h-4 w-4 animate-spin" />*/}
              {/*  ) : (*/}
              {/*    <Save className="mr-2 h-4 w-4" />*/}
              {/*  )}*/}
              {/*  Save Quotation*/}
              {/*</Button>*/}

              <Button
                // CHANGE THIS: Add the second argument (onError) to see why it fails
                onClick={handleSubmit(onSubmit, (errors) =>
                  console.log("FORM ERRORS:", errors),
                )}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Quotation
              </Button>
            </div>
          </section>

          <section>
            <h1 className="text-2xl font-bold">New Quotation</h1>
          </section>

          <section className="mx-auto p-8">
            <div className="flex flex-col items-center space-y-4">
              {/* 4. Connected Inputs */}
              <InlineEdit
                defaultValue={values.title}
                className="max-w-fit border-dotted text-3xl"
                onSave={(val) => handleFieldChange("title", val)}
              />
              <InlineEdit
                defaultValue={values.subTitle}
                className="max-w-fit border-dotted border-white/30 text-sm font-light text-white/30"
                onSave={(val) => handleFieldChange("subTitle", val)}
              />
            </div>
          </section>

          <section className="flex flex-row items-center justify-evenly gap-10 px-10">
            <div className="flex w-1/2 flex-col gap-4">
              {/* Quote No */}
              <div className="grid grid-cols-[180px_1fr] items-start gap-6 pl-20">
                <div className="border border-dashed border-transparent p-2 text-sm font-light">
                  Quote No.
                </div>
                <div className="flex flex-col">
                  {isSettingsLoading ? (
                    <div className="text-muted-foreground flex items-center gap-2 p-2 text-sm">
                      <Loader2 className="h-3 w-3 animate-spin" /> Loading...
                    </div>
                  ) : (
                    <InlineEdit
                      defaultValue={settings?.nextQuotationNumber}
                      pencilIcon={false}
                      className="border-foreground/40 text-sm font-light"
                      onSave={(val) => handleFieldChange("number", val)}
                    />
                  )}
                  <p className="text-foreground/50 mt-1 text-xs">
                    Auto-generated from Settings
                  </p>
                </div>
              </div>

              {/* Quotation Date */}
              <div className="grid grid-cols-[180px_1fr] items-start gap-6 pl-20">
                <div className="p-2 text-sm font-light">Quotation Date</div>
                <DatePicker
                  value={values.date ? new Date(values.date) : undefined}
                  onChange={(date) =>
                    handleFieldChange(
                      "date",
                      date ? format(date, "yyyy-MM-dd") : "",
                    )
                  }
                />
              </div>

              {/* Due Date */}
              <div className="grid grid-cols-[180px_1fr] items-start gap-6 pl-20">
                <div className="p-2 text-sm font-light">Due Date</div>
                <DatePicker
                  value={values.dueDate ? new Date(values.dueDate) : undefined}
                  onChange={(dueDate) =>
                    handleFieldChange(
                      "dueDate",
                      dueDate ? format(dueDate, "yyyy-MM-dd") : "",
                    )
                  }
                />
              </div>
            </div>

            <div className="flex w-1/2 justify-center">Your Logo</div>
          </section>

          <section className="flex flex-row items-start justify-evenly gap-10 px-10">
            {/* LEFT - Quotation From */}
            <div className="flex w-1/2 flex-col items-start gap-4 pl-20">
              <h3 className="mb-4 border-b border-dashed border-transparent text-2xl">
                Quotation From
              </h3>

              {/* 5. Connected Select */}
              <Select
                onValueChange={(val) => handleFieldChange("from", val)}
                defaultValue={values.from}
              >
                <SelectTrigger className="bg-foreground/10 flex w-full items-center justify-between rounded-md px-4 py-2 text-start">
                  <SelectValue placeholder="Select Business" />
                  <ChevronDownIcon className="text-foreground/40 -mr-1 ml-2 h-5 w-5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Businesses</SelectLabel>
                    <SelectItem value="Devolve Studio">
                      Devolve Studio
                    </SelectItem>
                    <SelectItem value="Other Business">
                      Other Business
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* Visual Display only - normally this updates based on Selection */}
              <div className="flex w-full items-center justify-between">
                <p className="text-xl font-bold">Business Details</p>
                <div className="text-foreground/50 hover:text-foreground flex cursor-pointer items-center gap-1 border-b transition">
                  <PencilIcon className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </div>
              </div>
              <div className="grid w-full grid-cols-[220px_1fr] items-center gap-6">
                <p className="text-foreground/70 text-xl font-light">
                  Business Name:
                </p>
                <p className="text-md font-light">{values.from}</p>
              </div>
            </div>

            {/* RIGHT - Quotation To */}
            <div className="flex w-1/2 flex-col items-start gap-4 pl-20">
              <h3 className="mb-4 border-b border-dashed border-transparent text-2xl">
                Quotation To
              </h3>

              <Select
                onValueChange={(val) => handleFieldChange("to", val)}
                defaultValue={values.to}
              >
                <SelectTrigger className="bg-foreground/10 flex w-full items-center justify-between rounded-md px-4 py-2 text-start">
                  <SelectValue placeholder="Select Client" />
                  <ChevronDownIcon className="text-foreground/40 -mr-1 ml-2 h-5 w-5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Client</SelectLabel>
                    <SelectItem value="Dev Infotech">Dev Infotech</SelectItem>
                    <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex w-full items-center justify-between">
                <p className="text-xl font-bold">Business Details</p>
                <div className="text-foreground/50 hover:text-foreground flex cursor-pointer items-center gap-1 border-b transition">
                  <PencilIcon className="h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </div>
              </div>

              <div className="grid w-full grid-cols-[220px_1fr] items-center gap-6">
                <p className="text-foreground/70 text-xl font-light">
                  Business Name:
                </p>
                <p className="text-md font-light">{values.to}</p>
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
