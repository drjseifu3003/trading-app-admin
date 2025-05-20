"use client"

import { Bell, Search, HelpCircle, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"
import { useLogoutMutation } from "@/lib/api/auth-api-slice"

export function DashboardHeader() {
  const { user } = useAppSelector((state) => state.auth)
  const pathname = usePathname()
  const router = useRouter()
  const [logout] = useLogoutMutation()

  // Generate breadcrumb from pathname
  const getBreadcrumb = () => {
    const parts = pathname.split("/").filter(Boolean)
    if (parts.length === 1) return "Dashboard"
    return parts[1].charAt(0).toUpperCase() + parts[1].slice(1)
  }

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      router.push("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => {
            const sidebar = document.querySelector(".sidebar-mobile-toggle")
            if (sidebar) {
              ;(sidebar as HTMLButtonElement).click()
            }
          }}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold">{getBreadcrumb()}</h1>
        </div>
        <div className="relative w-64 md:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="w-full pl-8" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
