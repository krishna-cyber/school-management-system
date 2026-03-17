import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function AppTitle() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
          asChild
        >
          <div>
            <Link
              href="#"
              className="grid flex-1 text-start text-sm leading-tight"
            >
              <span className="truncate font-bold">Shadcn-Admin</span>
              <span className="truncate text-xs">Next + ShadcnUI</span>
            </Link>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
