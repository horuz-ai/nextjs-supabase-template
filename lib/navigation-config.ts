import {
  LayoutDashboard,
  Settings,
  Users,
  CreditCard,
  FolderOpen,
  FileText,
  BarChart3,
  UserCircle,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export type Project = {
  name: string
  url: string
  icon: LucideIcon
}

export const navigationConfig = {
  mainNav: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderOpen,
      items: [
        {
          title: "All Projects",
          url: "/projects",
        },
        {
          title: "Recent",
          url: "/projects/recent",
        },
        {
          title: "Archived",
          url: "/projects/archived",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Overview",
          url: "/analytics",
        },
        {
          title: "Reports",
          url: "/analytics/reports",
        },
        {
          title: "Insights",
          url: "/analytics/insights",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "API Keys",
          url: "/settings/api-keys",
        },
      ],
    },
  ] as NavItem[],
  
  projects: [
    {
      name: "Marketing Campaign",
      url: "/projects/marketing-campaign",
      icon: FileText,
    },
    {
      name: "Product Launch",
      url: "/projects/product-launch",
      icon: BarChart3,
    },
    {
      name: "Customer Portal",
      url: "/projects/customer-portal",
      icon: Users,
    },
  ] as Project[],
  
  userNav: [
    {
      title: "Profile",
      url: "/settings/profile",
      icon: UserCircle,
    },
    {
      title: "Billing",
      url: "/settings/billing",
      icon: CreditCard,
    },
    {
      title: "Team",
      url: "/settings/team",
      icon: Users,
    },
  ] as NavItem[],
}

// Helper function to get active nav item based on current path
export function getActiveNavItem(pathname: string, items: NavItem[]): NavItem | null {
  for (const item of items) {
    if (item.url === pathname) {
      return item
    }
    if (item.items) {
      for (const subItem of item.items) {
        if (subItem.url === pathname) {
          return item
        }
      }
    }
  }
  return null
}