import { AdminHeader } from "@/components/admin-header";
import { AdminSettingsForm } from "@/components/admin-settings-form";

export default function AdminSettingsPage() {
  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application settings and preferences.
          </p>
        </div>
        <div className="max-w-4xl">
          <AdminSettingsForm />
        </div>
      </div>
    </>
  );
}
