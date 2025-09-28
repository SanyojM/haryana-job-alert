import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function AdminLayout({children}:{children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-lg font-medium">Admin Panel</h1>
        <div className="flex-1">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
