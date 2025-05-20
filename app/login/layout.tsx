"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  return <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">{children}</div>
}
