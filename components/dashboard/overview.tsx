"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, LineChart, ArrowUpDown, CreditCard } from "lucide-react"
import { useGetUsersQuery } from "@/lib/api/users-api-slice"
import { useGetTradesQuery } from "@/lib/api/trades-api-slice"
import { useGetRequestsQuery } from "@/lib/api/requests-api-slice"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardOverview() {
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery()
  const { data: trades, isLoading: isLoadingTrades } = useGetTradesQuery()
  const { data: requests, isLoading: isLoadingRequests } = useGetRequestsQuery()

  const pendingDeposits = requests?.filter((req) => req.type === "deposit" && req.status === "pending").length || 0
  const pendingWithdrawals =
    requests?.filter((req) => req.type === "withdrawal" && req.status === "pending").length || 0
  const totalTrades = trades?.length || 0
  const totalUsers = users?.length || 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard Overview</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <LineChart className="mr-2 h-4 w-4" />
            Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">Active trading platform users</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingTrades ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalTrades}</div>
                <p className="text-xs text-muted-foreground">Completed and pending trades</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Deposits</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{pendingDeposits}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{pendingWithdrawals}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="shadow-sm lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trades</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingTrades ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {trades?.slice(0, 5).map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div>
                      <p className="font-medium">{trade.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {trade.tradeDate} at {trade.tradeTime}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "font-medium rounded-md px-2 py-1 text-sm",
                        trade.finalWinLoss > 0
                          ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
                      )}
                    >
                      {trade.finalWinLoss > 0 ? "+" : ""}
                      {trade.finalWinLoss}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Requests</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingRequests ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {requests?.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div>
                      <p className="font-medium">{request.username}</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex h-2 w-2 rounded-full",
                            request.status === "pending"
                              ? "bg-yellow-500"
                              : request.status === "approved"
                                ? "bg-green-500"
                                : "bg-red-500",
                          )}
                        ></span>
                        <p className="text-sm text-muted-foreground capitalize">
                          {request.type} - {request.status}
                        </p>
                      </div>
                    </div>
                    <div className="font-medium">${request.amount}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
