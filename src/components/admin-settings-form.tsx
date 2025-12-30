"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { IconLoader2, IconSettings } from "@tabler/icons-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  settingsFormSchema,
  type SettingsFormValues,
} from "@/lib/validations/forms";
import { api } from "@/trpc/client";

export function AdminSettingsForm() {
  const { data: settings, isLoading: isLoadingSettings } =
    api.settings.getAll.useQuery();
  const utils = api.useUtils();

  const updateSettings = api.settings.updateMany.useMutation({
    onSuccess: () => {
      toast.success("Instellingen opgeslagen!", {
        description: "Je wijzigingen zijn succesvol opgeslagen.",
      });
      utils.settings.getAll.invalidate();
    },
    onError: () => {
      toast.error("Opslaan mislukt!", {
        description: "Probeer het later opnieuw.",
      });
    },
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      contactEmail: "",
      maintenanceMode: false,
      allowRegistration: true,
    },
  });

  // Load settings into form when data arrives
  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        contactEmail: settings.contactEmail,
        maintenanceMode: settings.maintenanceMode === "true",
        allowRegistration: settings.allowRegistration === "true",
      });
    }
  }, [settings, form]);

  async function onSubmit(data: SettingsFormValues) {
    updateSettings.mutate(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconSettings className="size-5" />
          General Settings
        </CardTitle>
        <CardDescription>
          Manage your site&apos;s general configuration and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter site name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This will be displayed across your site.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter site description"
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description for SEO and social media.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="contact@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Primary email for site communications.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Maintenance Mode</FormLabel>
                      <FormDescription>
                        Enable this to show a maintenance page to visitors.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="allowRegistration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Allow User Registration</FormLabel>
                      <FormDescription>
                        Allow new users to create accounts on your site.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={updateSettings.isPending || isLoadingSettings}
            >
              {updateSettings.isPending ? (
                <>
                  <IconLoader2 className="mr-2 size-4 animate-spin" />
                  Opslaan...
                </>
              ) : (
                "Opslaan"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
