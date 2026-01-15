"use client";

import { z } from "zod";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { ChevronDownIcon, PencilIcon } from "lucide-react";
import { router } from "next/dist/client";
import { toast } from "sonner";

const quotationSchema = z.object({
  id: z.string().optional(),

  quotationNumber: z.string(),
  quotationTitle: z.string(),
  quotationDate: z.date().optional(),
  quotationDueDate: z.date().optional(),
  quotationFrom: z.string().optional(),
  quotationTo: z.string().optional(),
  quotationStatus: z
    .enum(["Draft", "Sent", "Approved", "Rejected"])
    .default("Draft")
    .optional(),
});

type QuotationFormValues = z.infer<typeof quotationSchema>;

export default function NewQuotationPage() {

  const utils = api.useUtils();

  const form = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      quotationNumber: "001",
      quotationTitle: "Quotation",
      quotationFrom: "Devolve Studio",
      quotationTo: "NoCompany",
      quotationStatus: "Draft",
    }
  })

  const createMutation = api.quotation.create.useMutation({
    onSuccess: async() => {
      toast.success("Quotation Created SuccessFully");
      await router.push("/quotations");
      await utils.quotation.getAll.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = (values: QuotationFormValues) => {
    createMutation.mutate(values);
  }

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
                { label: "Quotations", href: "/quotations" },
                { label: "New Quotation" },
              ]}
            />
          </section>
          <section>
            <h1 className="text-2xl font-bold">New Quotation</h1>
          </section>
          <section className="mx-auto p-8">
            <div className="flex flex-col items-center space-y-4">
              <InlineEdit
                defaultValue="Quotation Title"
                className="max-w-fit border-dotted text-3xl"
                onSave={(newValue) => console.log("Saved:", newValue)}
              />
              <InlineEdit
                defaultValue="Quotation Subtitle"
                className="max-w-fit border-dotted border-white/30 text-sm font-light text-white/30"
                onSave={(newValue) => console.log("Saved:", newValue)}
              />
            </div>
          </section>
          <section className="flex flex-row items-center justify-evenly gap-10 px-10">
            <div className="flex w-1/2 flex-col gap-4">
              {/* Quote No */}
              <div className="grid grid-cols-[180px_1fr] items-start gap-6 pl-20">
                <InlineEdit
                  defaultValue="Quote No."
                  required
                  pencilIcon={false}
                  className="border-dashed text-sm font-light"
                  onSave={(v) => console.log("Saved:", v)}
                />

                <div className="flex flex-col">
                  <InlineEdit
                    defaultValue="001"
                    pencilIcon={false}
                    className="border-foreground/40 text-sm font-light"
                    onSave={(v) => console.log("Saved:", v)}
                  />
                  <p className="text-foreground/50 mt-1 text-xs">
                    Last Quote No. INV-2025-3001
                  </p>
                </div>
              </div>

              {/* Quotation Date */}
              <div className="grid grid-cols-[180px_1fr] items-start gap-6 pl-20">
                <InlineEdit
                  defaultValue="Quotation Date"
                  required
                  pencilIcon={false}
                  className="border-dashed text-sm font-light"
                  onSave={(v) => console.log("Saved:", v)}
                />

                <InlineEdit
                  defaultValue="Today"
                  pencilIcon={false}
                  className="border-foreground/40 text-sm font-light"
                  onSave={(v) => console.log("Saved:", v)}
                />
              </div>

              {/* Due Date */}
              <div className="grid grid-cols-[180px_1fr] items-start gap-6 pl-20">
                <InlineEdit
                  defaultValue="Due Date"
                  pencilIcon={false}
                  className="border-dashed text-sm font-light"
                  onSave={(v) => console.log("Saved:", v)}
                />

                <InlineEdit
                  defaultValue="T+14"
                  pencilIcon={false}
                  className="border-foreground/40 text-sm font-light"
                  onSave={(v) => console.log("Saved:", v)}
                />
              </div>
            </div>

            <div className="flex w-1/2 justify-center">Your Logo</div>
          </section>
          <section className="flex flex-row items-start justify-evenly gap-10 px-10">
            {/* LEFT */}
            <div className="flex w-1/2 flex-col items-start gap-4 pl-20">
              <InlineEdit
                defaultValue="Quotation From"
                pencilIcon={false}
                className="mb-4 border-dashed text-2xl"
              />

              <Select>
                <SelectTrigger className="bg-foreground/10 flex w-full items-center justify-between rounded-md px-4 py-2 text-start">
                  <SelectValue placeholder="Your Company" />
                  <ChevronDownIcon className="text-foreground/40 -mr-1 ml-2 h-5 w-5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Your Businesses</SelectLabel>
                    <SelectItem value="Devolve Studio">
                      Devolve Studio
                    </SelectItem>
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
                <p className="text-md font-light">Devolve Studio</p>
              </div>

              <div className="grid w-full grid-cols-[220px_1fr] items-start gap-6">
                <p className="text-foreground/70 text-xl font-light">
                  Address:
                </p>
                <div className="flex flex-col">
                  <p className="text-md font-light">Address Line1</p>
                  <p className="text-md font-light">Address Line2</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex w-1/2 flex-col items-start gap-4 pl-20">
              <InlineEdit
                defaultValue="Quotation To"
                pencilIcon={false}
                className="mb-4 border-dashed text-2xl"
              />

              <Select>
                <SelectTrigger className="bg-foreground/10 flex w-full items-center justify-between rounded-md px-4 py-2 text-start">
                  <SelectValue placeholder="Your Company" />
                  <ChevronDownIcon className="text-foreground/40 -mr-1 ml-2 h-5 w-5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Client</SelectLabel>
                    <SelectItem value="Devolve Studio">
                      Devolve Studio
                    </SelectItem>
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
                <p className="text-md font-light">Dev Infotech</p>
              </div>

              <div className="grid w-full grid-cols-[220px_1fr] items-start gap-6">
                <p className="text-foreground/70 text-xl font-light">
                  Address:
                </p>
                <div className="flex flex-col">
                  <p className="text-md font-light">Address Line1</p>
                  <p className="text-md font-light">Address Line2</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}