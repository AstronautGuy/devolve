import { OrganizationProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="flex justify-center p-8">
      <OrganizationProfile />
    </div>
  );
}
