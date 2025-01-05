"use client";

import * as React from "react";
import {
  AudioWaveform,
  Bot,
  Command,
  GalleryVerticalEnd,
  HandshakeIcon,
  Map,
  PieChart,
  PlusIcon,
  PlusSquareIcon,
  Settings2,
  SquareTerminal,
  User2,
} from "lucide-react";

import { NavMain } from "@/components/nav/nav-main";
import { NavCrm } from "@/components/nav/nav-crm";
import { NavUser } from "@/components/nav/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Projects",
      url: "#",
      icon: PlusSquareIcon,
      isActive: true,
      items: [
        {
          title: "Add Project",
          url: "/project",
        },
        {
          title: "View Projects",
          url: "/projects",
        },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Completed Projects",
          url: "#",
        },
        {
          title: "On Going Projects",
          url: "#",
        },
        {
          title: "Up coming Projects",
          url: "#",
        },
      ],
    },
    {
      title: "Leads",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Leads by direct application",
          url: "#",
        },
        {
          title: "Lead by Channel Partner",
          url: "#",
        },
        {
          title: "Other Leads",
          url: "#",
        },
      ],
    },
  ],
  crm: [
    {
      name: "Dashboard",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Users",
      url: "#",
      icon: User2,
    },
    {
      name: "Channel Partners",
      url: "#",
      icon: HandshakeIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavCrm crm={data.crm} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
