"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Download, Filter, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetTradesQuery, useUpdateTradeStatusMutation } from "@/lib/api/trades-api-slice"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function TradesList() {
  const { data: trades, isLoading, error } = useGetTradesQuery()
  const [updateTradeStatus] = useUpdateTradeStatusMutation()
  const [statusFilter, setStatusFilter] = useState("all")


  const handleUpdateStatus = async (tradeId: string, status: "pending" | "completed" | "cancelled") => {
    try {
      await updateTradeStatus({ tradeId, status }).unwrap()
      toast({
        title: "Trade Status Updated",
        description: `Trade status has been updated to ${status}.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update trade status. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading trades: {typeof error === "object" && "status" in error ? `${error.status}` : "Unknown error"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Trades List</h1>
          <p className="text-muted-foreground">View and manage all platform trades</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Trade Type</TableHead>
              <TableHead>Expected Win</TableHead>
              <TableHead>Final Win/Loss</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              [...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : trades?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No trades found.
                </TableCell>
              </TableRow>
            ) : (
              trades?.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.email}</TableCell>
                  <TableCell>{trade.date}</TableCell>
                  <TableCell>{trade.time}</TableCell>
                  <TableCell>{trade.type}</TableCell>
                  <TableCell
                    className={cn(
                      "font-mono text-green-600 dark:text-green-400",
                    )}
                  >
                    {"+"}
                    {trade.expected_profit_loss}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "font-mono",
                      trade.win  ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                    )}
                  >
                    {trade.win ? "+" : "-"}
                    {trade.final_profit_loss}
                  </TableCell>
                  
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
