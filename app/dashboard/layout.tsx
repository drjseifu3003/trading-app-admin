"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { useAppSelector } from "@/lib/hooks"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  // Protect dashboard routes
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Don't render anything until we've checked authentication
  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-muted/20">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col md:ml-64">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
