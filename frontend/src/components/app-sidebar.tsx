import * as React from "react"
import { GalleryVerticalEnd, Minus, Plus } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        },
        {
          title: "Categories",
          url: "/admin/getting-started/categories",
        },
        {
          title: "Tags",
          url: "/admin/getting-started/tags",
        },
        {
          title: "Users",
          url: "/admin/getting-started/users",
        }
      ],
    },
    {
      title: "Content",
      items: [
        {
          title: "Post Templates",
          url: "/admin/posts/post-templates",
        },
        {
          title: "All Posts",
          url: "/admin/posts",
        },
        {
          title: "Add New Post",
          url: "/admin/posts/new",
        },
      ],
    },
    {
      title: "Mock Tests",
      items: [
        {
          title: "Categories",
          url: "/admin/mock-tests/mock-categories",
        },
        {
          title: "Tags",
          url: "/admin/mock-tests/mock-tags",
        },
        {
          title: "Test Series",
          url: "/admin/mock-tests/mock-test-series",
        },
        {
          title: "Mock Tests",
          url: "/admin/mock-tests",
        },
      ],
    },
    {
      title: "Courses",
      items: [
        {
          title: "All Courses",
          url: "/admin/courses",
        },
        {
          title: "Add New Course",
          url: "/admin/courses/new",
        },
        {
          title: "Update Course",
          url: "/admin/courses/update",
        },
        {
          title: "Categories",
          url: "/admin/course-categories",
        },
        {
          title: "Tags",
          url: "/admin/course-tags",
        },
        {
          title: "Reviews",
          url: "/admin/reviews",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentPath = usePathname()
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Haryana Job Alerts</span>
                  <span className="">Powered by Softricity</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  defaultOpen={item.items?.some((sub) => currentPath === sub.url)}
                  className="group/collapsible"
                >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    {item.title}{" "}
                    <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                    {item.items.map((sub) => (
                      <SidebarMenuSubItem key={sub.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={currentPath === sub.url}
                      >
                        <Link href={sub.url}>{sub.title}</Link>
                      </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
                </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}


