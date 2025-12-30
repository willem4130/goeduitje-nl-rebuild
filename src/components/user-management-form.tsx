"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2, IconUserPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userFormSchema, type UserFormValues } from "@/lib/validations/forms";
import { api } from "@/trpc/client";

interface UserManagementFormProps {
  user?: UserFormValues & { id?: string };
  mode?: "create" | "edit";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserManagementForm({
  user,
  mode = "create",
  onSuccess,
  onCancel,
}: UserManagementFormProps) {
  const utils = api.useUtils();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      toast.success("Gebruiker aangemaakt!", {
        description: "De gebruiker is succesvol toegevoegd.",
      });
      form.reset();
      utils.user.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Aanmaken mislukt!", {
        description: error.message || "Probeer het later opnieuw.",
      });
    },
  });

  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      toast.success("Gebruiker bijgewerkt!", {
        description: "De wijzigingen zijn opgeslagen.",
      });
      utils.user.getAll.invalidate();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Bijwerken mislukt!", {
        description: error.message || "Probeer het later opnieuw.",
      });
    },
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user || {
      name: "",
      email: "",
      role: "user",
      bio: "",
    },
  });

  const isLoading = createUser.isPending || updateUser.isPending;

  async function onSubmit(data: UserFormValues) {
    if (mode === "edit" && user?.id) {
      updateUser.mutate({ id: user.id, ...data });
    } else {
      createUser.mutate(data);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconUserPlus className="size-5" />
          {mode === "create" ? "Add New User" : "Edit User"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Create a new user account with the form below."
            : "Update user information and role permissions."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Assign permissions based on user responsibility.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about this user..."
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Maximum 500 characters.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader2 className="mr-2 size-4 animate-spin" />
                    {mode === "create" ? "Creating..." : "Saving..."}
                  </>
                ) : (
                  <>{mode === "create" ? "Create User" : "Save Changes"}</>
                )}
              </Button>
              {mode === "edit" && onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Annuleren
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
