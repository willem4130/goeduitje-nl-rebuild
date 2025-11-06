import { AdminHeader } from "@/components/admin-header";
import { UserManagementForm } from "@/components/user-management-form";

export default function AdminUsersPage() {
  return (
    <>
      <AdminHeader />
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Add, edit, and manage user accounts and permissions.
          </p>
        </div>
        <div className="max-w-4xl">
          <UserManagementForm mode="create" />
        </div>
      </div>
    </>
  );
}
