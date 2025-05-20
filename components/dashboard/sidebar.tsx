"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, LineChart, CreditCard, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { useLogoutMutation } from "@/lib/api/auth-api-slice"

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile, toggleSidebar } = useSidebar()
  const [logout] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      router.push("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-50 md:hidden" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      )}

      <div className="fixed left-0 top-0 z-20 h-full w-64 border-r bg-background">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-center border-b p-4">
            <div className="flex items-center space-x-2">
              <LineChart className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Trade Admin</h2>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto p-4">
            <nav className="space-y-2">
              <Link
                href="/dashboard"
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                Dashboard
              </Link>

              <Link
                href="/dashboard/users"
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/dashboard/users"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Users className="mr-2 h-5 w-5" />
                Users
              </Link>

              <Link
                href="/dashboard/trades"
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/dashboard/trades"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <LineChart className="mr-2 h-5 w-5" />
                Trades
              </Link>

              {/* <Link
                href="/dashboard/requests"
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === "/dashboard/requests"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Requests
              </Link> */}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
