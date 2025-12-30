"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconFileDescription,
  IconHelp,
  IconInbox,
  IconInnerShadowTop,
  IconSearch,
  IconSettings,
  IconShoppingCart,
  IconStar,
  IconToolsKitchen2,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Workshops",
      url: "/admin/workshops",
      icon: IconToolsKitchen2,
    },
    {
      title: "Berichten",
      url: "/admin/feedback",
      icon: IconInbox,
    },
    {
      title: "Reviews",
      url: "/admin/reviews",
      icon: IconStar,
    },
    {
      title: "Gebruikers",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Boekingen",
      url: "/admin/bookings",
      icon: IconShoppingCart,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Content",
      icon: IconFileDescription,
      isActive: true,
      url: "/admin/content",
      items: [
        {
          title: "Pages",
          url: "/admin/content/pages",
        },
        {
          title: "Blog Posts",
          url: "/admin/content/blog",
        },
        {
          title: "Media Library",
          url: "/admin/content/media",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "/admin/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Admin Panel</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.navClouds.length > 0 && <NavDocuments items={data.documents} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
