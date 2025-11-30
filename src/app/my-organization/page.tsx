"use client";

import { useAuth, useOrganization } from "@clerk/nextjs";

export default function MyOrganization() {
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { has, isLoaded: authLoaded } = useAuth();

  // Wait for both to load
  if (!authLoaded || !orgLoaded) return <p>Loading...</p>;
  if (!organization) return <p>No organization found.</p>;

  // Now has is guaranteed to be defined
  const isAdmin = has({ role: 'org:admin' });

  return (
    <main className="flex p-6 min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex items-center gap-4">
        <img
          src={organization.imageUrl}
          alt={organization.name}
          className="w-16 h-16 rounded-xl object-cover"
        />
        <h1 className="text-2xl font-semibold">
          {organization.name}
        </h1>
      </div>

      {isAdmin && (
        <div className="mt-4">
          <p>Admin controls visible here</p>
        </div>
      )}
    </main>
  );
}