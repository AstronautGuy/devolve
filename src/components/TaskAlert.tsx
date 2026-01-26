"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { Bell, AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose, // Import this to close sheet on interaction
} from "~/components/ui/sheet";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TaskAlert() {
  const router = useRouter();

  // Fetch the pending task
  const { data: task, isLoading } = api.tasks.getPending.useQuery();

  // Ref to track which task ID we have already alerted for
  const lastToastedId = useRef<string | null>(null);

  const hasUnread = !!task;

  // Add Toast Effect: Pop up when a NEW task is found
  useEffect(() => {
    // Only toast if there is a task AND it has a different ID than the last one we toasted
    if (task && task.id !== lastToastedId.current) {
      lastToastedId.current = task.id; // Mark this specific task as shown

      setTimeout(() => {
        toast.info(task.title, {
          description: task.description,
          // Removed "text-black" to support dark mode
          duration: 8000,
          icon: <AlertCircle className="h-5 w-5 text-blue-500" />,
          action: task.link
            ? {
                label: "View Details",
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
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground relative"
        >
          {/* Adjusted Icon Size: h-10 was too big for standard UI, h-5 is standard */}
          <Bell className="h-5 w-5" />

          {/* Red Dot Indicator */}
          {hasUnread && (
            <span className="border-background absolute top-2 right-2 h-2.5 w-2.5 rounded-full border-2 bg-red-600 shadow-sm" />
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
            <div className="text-muted-foreground flex items-center gap-3 p-4 text-sm">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              Checking for tasks...
            </div>
          ) : !task ? (
            <div className="text-muted-foreground/60 flex flex-col items-center justify-center gap-2 py-12 text-center">
              <CheckCircle2 className="h-12 w-12" />
              <p className="text-foreground font-medium">All caught up!</p>
              <p className="text-xs">No pending tasks found.</p>
            </div>
          ) : (
            // Notification Card
            <div className="group bg-card text-card-foreground hover:border-primary/50 relative overflow-hidden rounded-xl border p-5 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="mt-1 rounded-full bg-blue-500/10 p-2.5 text-blue-500 transition-colors group-hover:bg-blue-500/20">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{task.title}</h4>
                    <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>
              </div>

              {task.link && (
                <div className="mt-4 flex justify-end">
                  {/* SheetClose ensures the sheet closes when the user clicks the link */}
                  <SheetClose asChild>
                    <Link href={task.link} className="w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 text-xs font-medium"
                      >
                        View Details <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
