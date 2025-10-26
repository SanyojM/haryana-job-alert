import Sidebar from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider
} from "@/components/ui/sidebar"

export default function AdminLayout({children}:{children: React.ReactNode}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 max-h-screen h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
