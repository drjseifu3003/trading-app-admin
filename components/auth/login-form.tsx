"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart } from "lucide-react"
import { useLoginMutation } from "@/lib/api/auth-api-slice"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const [login, { isLoading, error: loginError }] = useLoginMutation()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login({ email, password }).unwrap()
      router.push("/dashboard")
    } catch (err) {
      // Error is handled by the RTK Query and reflected in the state
      console.error("Login failed:", err)
    }
  }

  // Format error message from API response
  const getErrorMessage = () => {
    if (!loginError) return null

    if ("data" in loginError) {
      const errorData = loginError.data as any
      return errorData?.message || "Invalid credentials. Please try again."
    }

    return "Login failed. Please try again."
  }

  const errorMessage = getErrorMessage()

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LineChart className="h-6 w-6 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Trade Admin</CardTitle>
        <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="h-auto p-0 text-xs">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <p className="text-sm text-muted-foreground">Demo credentials: admin / password</p>
      </CardFooter>
    </Card>
  )
}
