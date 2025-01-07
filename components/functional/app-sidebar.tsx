"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { UserExtended } from "@/actions/auth/types"
import { usePathname } from "next/navigation"

// This is sample data.


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const [data, setData] = React.useState({
    navMain: [
      {
        title: "Appointments",
        url: "/dashboard",
        icon: Calendar,
        
        items: [
          {
            title: "Upcoming",
            url: "/dashboard/appointments/upcoming",
          },
          {
            title: "Past",
            url: "/dashboard/appointments/past",
          },
          {
            title: "Cancelled",
            url: "/dashboard/appointments/cancelled",
          },
          {
            title:'Setup',
            url:'/dashboard/appointments/setup',
          }
        ],
      },
      {
        title: "Patients",
        url: "/dashboard/patients",
        icon: Users2,
        items: [
          {
            title: "All",
            url: "/dashboard/patients",
          }, 
          {
            title: "On therapy",
            url: "/dashboard/patients/on-therapy",
          },
          {
            title: "Archive",
            url: "/dashboard/patients/archive",
          }
        ],
      },
      {
        title: "Documents",
        url: "/dashboard/documents",
        icon: BookOpen,
        items: [
          {
            title: "All",
            url: "/dashboard/documents",
          },
          {
            title: "Lab",
            url: "/dashboard/documents?type=lab",
          }
        ],
      },
      
    ],
    
  })
  React.useEffect(() => {
    setData(prev => ({
      ...prev,
      navMain: prev.navMain.map(item => ({
        ...item,
        isActive: item.url === pathname
      }))
    }))
  }, [pathname])
  const currentUser = useSession().data?.user as UserExtended
  if(!currentUser) return null
  return (
    <Sidebar  collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={[{
          logo: GalleryVerticalEnd,
          name: currentUser?.workspace_name ? currentUser?.workspace_name : "No Workspace",
          plan: currentUser?.role ? currentUser?.role : "No Role"
        }]} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          avatar: currentUser?.image,
          email: currentUser?.email,
          name: currentUser?.name
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
