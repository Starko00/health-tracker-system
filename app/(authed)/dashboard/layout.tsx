"use client"
import { AppSidebar } from "@/components/functional/app-sidebar";
import BreadcrumbListAuto from "@/components/functional/breadcrumb-list-auto";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Providers from "@/utils/providers";
import React, { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
  <Providers>
    <SidebarProvider>
     <AppSidebar />
      <SidebarInset>
      <header className="flex h-16 sticky top-0 bg-white border-b border-border shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="">
             <BreadcrumbListAuto/>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 p-4 ">
        {children}
        </div>
        </SidebarInset>
        </SidebarProvider>
        </Providers>
    
  );
}
