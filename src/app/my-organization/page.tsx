"use client";

import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MyOrganization() {
  const currentPath = usePathname(); // current path

  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded: userLoaded } = useUser();
  const { has, isLoaded: authLoaded } = useAuth();

  // Wait for both to load
  if (!authLoaded || !orgLoaded || !userLoaded) return <p>Loading...</p>;
  if (!user) return <p>No User found.</p>;
  if (!organization) return <p>No organization found.</p>;

  // Now has is guaranteed to be defined
  const isAdmin = has({ role: "org:admin" });

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] p-6 text-white">
      {/* New horizontal wrapper */}
      <div className="flex w-full items-start justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <img
            src={organization.imageUrl}
            alt={organization.name}
            className="h-16 w-16 rounded-xl object-cover"
          />
          <div>
            <h1 className="text-2xl font-light">{organization.name}</h1>
            <h1 className="text-2xl font-bold">Welcome {user.fullName},</h1>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <div className="bg-white p-4 rounded-xl text-black">
              <Link href={`${currentPath}/manage`}>Manage Org.</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
