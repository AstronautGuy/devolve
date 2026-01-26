"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useOrganization } from "@clerk/nextjs";

// UI Components
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Loader2 } from "lucide-react";

// 1. Define Zod Schema
const onboardingSchema = z.object({
  address: z
    .string()
    .trim()
    .min(10, "Address must be more descriptive.")
    .max(200, "Address is too long.")
    .regex(/[a-zA-Z]/, "Address cannot be only numbers or symbols.")
    .regex(/\d/, "Address must include a building or house number.")
    .regex(/[a-zA-Z]{3,}/, "Address must contain a locality or area name."),

  gstId: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Enter a valid GST number (15 characters, proper format).",
    ),

  industry: z.string().min(1, "Please select an industry."),

  staff: z
    .string()
    .min(1, "Please select a staff size.")
    .refine(
      (v) => ["1-10", "11-50", "51-200", "200+"].includes(v),
      "Invalid staff size range.",
    ),
});

// Explicitly export the type for reuse
type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { organization } = useOrganization();
  const utils = api.useUtils();

  // 2. Setup Form with Explicit Generic Type
  // This fixes the "Unsafe member access" errors by telling TS exactly what the form shape is
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      address: "",
      gstId: "",
      industry: "",
      staff: "",
    },
  });

  // 3. Setup Mutation
  const updateProfileMutation = api.profile.update.useMutation({
    onSuccess: async () => {
      toast.success("Setup Complete!", {
        description: "Your organization profile has been created.",
      });
      await utils.tasks.getPending.invalidate();
      router.push("/my-organization");
    },
    onError: (error) => {
      // Safe error handling with nullish coalescing (??)
      toast.error("Something went wrong", {
        description: error.message ?? "Failed to save profile",
      });
    },
  });

  function onSubmit(values: OnboardingFormValues) {
    updateProfileMutation.mutate(values);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-lg border-slate-200 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-slate-900">
            Complete your Setup
          </CardTitle>
          <CardDescription>
            {/* Safe check for organization name */}
            Enter your business details for{" "}
            {organization?.name ?? "your organization"} to unlock full access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Innovation Dr, Tech City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gstId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST / Tax ID</FormLabel>
                    <FormControl>
                      <Input placeholder="22AAAAA0000A1Z5" {...field} />
                    </FormControl>
                    <FormDescription>
                      Used for invoicing and tax reports.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="manufacturing">
                            Manufacturing
                          </SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="staff"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Size</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 Employees</SelectItem>
                          <SelectItem value="11-50">11-50 Employees</SelectItem>
                          <SelectItem value="51-200">
                            51-200 Employees
                          </SelectItem>
                          <SelectItem value="201+">201+ Employees</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save & Continue to Dashboard"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
