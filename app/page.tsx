"use client"
import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import { DashboardCards } from "@/components/DashboardCard";
import Login from "@/components/Login";
import { useEffect } from 'react';
import { useAuthStore } from "@/hooks/use-auth";

export default function Page() {
  const { checkAuth } = useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [])

  // Access the state
  const { isAuthenticated } = useAuthStore()

  return (
    <div>
      {!isAuthenticated ? (
        <Login isLogin={true} />
      ) : (
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b">
              <div className="flex items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <ModeToggle />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                <DashboardCards
                  title="Total Users"
                  isGreen={true}
                  value={300}
                  description="+20 user from last month"
                />
                <DashboardCards
                  title="Total Leads"
                  isGreen={false}
                  value={200}
                  description="-20 leads from last month"
                />
                <DashboardCards
                  title="Total Projects"
                  isGreen={true}
                  value={30}
                  description="+0 projects from last month"
                />
                <DashboardCards
                  title="Total Staff"
                  isGreen={true}
                  value={10}
                  description="+5 staff from last month"
                />
              </div>
              <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      )}
    </div>
  );
}