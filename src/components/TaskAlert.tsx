"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { Bell, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TaskAlert() {
  const router = useRouter();

  // Fetch the pending task
  const { data: task, isLoading } = api.task.getPending.useQuery();

  // Ref to prevent double-firing in Strict Mode
  const hasToasted = useRef(false);

  const hasUnread = !!task;

  // Add Toast Effect: Pop up when a task is found
  useEffect(() => {
    if (task && !hasToasted.current) {
      hasToasted.current = true; // Mark as shown

      // Small timeout ensures UI is ready
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        toast.info(task.title, {
          description: task.description,
          descriptionClassName: "text-black",
          duration: 8000, // Stay longer
          icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
          action: task.link
            ? {
              label: (
                <span className="inline-flex items-center gap-1">
                View Details <ExternalLink className="h-3 w-3" />
                </span>
              ),
                onClick: () => router.push(task.link!),
              }
            : undefined,
        });
      }, 500);
    }
  }, [task, router]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-12 w-12 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
          <Bell className="h-10 w-10" />
          {/* Red Dot Indicator */}
          {hasUnread && (
            <span className="absolute right-3 top-3 h-3 w-3 rounded-full border-2 border-white bg-red-600 shadow-sm" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Notifications</SheetTitle>
          <SheetDescription>
            You have {hasUnread ? "1" : "0"} unread task requiring attention.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex items-center gap-3 p-4 text-sm text-slate-500">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
              Checking for tasks...
            </div>
          ) : !task ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-slate-500 opacity-60">
              <Bell className="h-12 w-12" />
              <p className="font-medium">All caught up!</p>
              <p className="text-xs">No pending tasks found.</p>
            </div>
          ) : (
            // Notification Card
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200 group">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="mt-1 rounded-full bg-blue-50 p-2.5 text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{task.title}</h4>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">{task.description}</p>
                  </div>
                </div>
              </div>

              {task.link && (
                <div className="mt-4 flex justify-end">
                  <Link href={task.link} className="w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full gap-2 text-xs font-medium">
                      View Details <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}