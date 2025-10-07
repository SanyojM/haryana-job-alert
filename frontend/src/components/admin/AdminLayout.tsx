import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"

export default function AdminLayout({children}:{children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"/>
        <div className="flex-1 p-4 lg:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
