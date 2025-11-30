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
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TaskAlert() {
  const router = useRouter();

  // Fetch the pending task
  const { data: task, isLoading } = api.task.getPending.useQuery();

  const hasUnread = !!task;

  // Add Toast Effect: Pop up when a task is found
  useEffect(() => {
    if (task) {
      toast(task.title, {
        description: task.description,
        action: task.link ? {
          label: "Action",
          onClick: () => router.push(task.link!),
        } : undefined,
      });
    }
  }, [task, router]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700">
          <Bell className="h-5 w-5" />
          {/* Red Dot Indicator */}
          {hasUnread && (
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-600" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader className="mb-6">
          <SheetTitle>Notifications</SheetTitle>
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
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-slate-500">
              <Bell className="h-10 w-10 opacity-20" />
              <p>All caught up!</p>
              <p className="text-xs">No pending tasks found.</p>
            </div>
          ) : (
            // Notification Card
            <div className="relative rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="mt-0.5 rounded-full bg-blue-100 p-2 text-blue-600">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{task.title}</h4>
                    <p className="text-sm text-slate-600">{task.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end">
                {task.link && (
                  <Link href={task.link} className="w-full">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Details <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}