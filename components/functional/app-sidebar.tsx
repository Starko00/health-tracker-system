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
import { useQuery } from "@tanstack/react-query"
import { getUserDetails } from "@/actions/auth"

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
            url: "/dashboard?status=upcoming",
          },
          {
            title: "Past",
            url: "/dashboard?status=past",
          },
          {
            title: "Cancelled",
            url: "/dashboard?status=cancelled",
          },
          {
            title:'Setup',
            url:'/dashboard?action=setup',
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
            url: "/dashboard/patients?status=on-therapy",
          },
          {
            title: "Archive",
            url: "/dashboard/patients?status=archive",
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
          },
          {
            title: "Therapies",
            url: "/dashboard/documents?type=therapies",
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
  

  
  return (
    <Sidebar  collapsible="icon" {...props}>
      
      <SidebarHeader>
       <TeamSwitcher/> 
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
