"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { House } from "lucide-react";
import { TaskAlert } from "~/components/TaskAlert";

export function Header() {
  return (
    <header className="flex h-16 items-center justify-end gap-4 p-4">
      <Link href={"/public"}>
        <House />
      </Link>
      {/* When NOT logged in */}
      <SignedOut>
        <SignInButton />
        <SignUpButton>
          <button className="h-10 cursor-pointer rounded-full bg-[#6c47ff] px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base">
            Sign Up
          </button>
        </SignUpButton>
      </SignedOut>

      {/* When logged in */}
      <SignedIn>
        <TaskAlert />
        <Link
          href="/my-organization"
          className="flex h-10 items-center justify-center rounded-full bg-[#6c47ff] px-4 text-sm font-medium text-white sm:h-12 sm:px-5 sm:text-base"
        >
          My Organization
        </Link>
        <UserButton />
      </SignedIn>
    </header>
  );
}
