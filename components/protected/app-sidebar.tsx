"use client"

import * as React from "react"
import { User } from "@supabase/supabase-js"
import { GalleryVerticalEnd } from "lucide-react"

import { ProtectedNavMain } from "@/components/protected/nav-main"
import { ProtectedNavProjects } from "@/components/protected/nav-projects"
import { ProtectedNavUser } from "@/components/protected/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { navigationConfig } from "@/lib/navigation-config"

export function ProtectedAppSidebar({ user, ...props }: { user: User } & React.ComponentProps<typeof Sidebar>) {
  // We don't need to manage active states here anymore
  // The nav components will handle it internally

  // Sample teams data - in production, this would come from your database
  const teams = [
    {
      name: "Personal Workspace",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
  ]

  const userData = {
    name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    email: user.email || "",
    avatar: user.user_metadata?.avatar_url || "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <ProtectedNavMain items={navigationConfig.mainNav} />
        <ProtectedNavProjects projects={navigationConfig.projects} />
      </SidebarContent>
      <SidebarFooter>
        <ProtectedNavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}