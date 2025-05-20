"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ArrowDownCircle, ArrowUpCircle, Check, Download, Filter, X } from "lucide-react"
import { useGetRequestsQuery, useUpdateRequestStatusMutation } from "@/lib/api/requests-api-slice"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

export function RequestsList() {
  const { data: requests, isLoading, error } = useGetRequestsQuery()
  const [updateRequestStatus, { isLoading: isUpdatingStatus }] = useUpdateRequestStatusMutation()
  const [activeTab, setActiveTab] = useState("all")
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null)

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingRequestId(requestId)
      await updateRequestStatus({ requestId, status: "approved" }).unwrap()
      toast({
        title: "Request Approved",
        description: "The request has been approved successfully.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to approve request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingRequestId(null)
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      setProcessingRequestId(requestId)
      await updateRequestStatus({ requestId, status: "rejected" }).unwrap()
      toast({
        title: "Request Rejected",
        description: "The request has been rejected.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to reject request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingRequestId(null)
    }
  }

  const filteredRequests =
    activeTab === "all"
      ? requests
      : activeTab === "deposits"
        ? requests?.filter((req) => req.type === "deposit")
        : requests?.filter((req) => req.type === "withdrawal")

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading requests: {typeof error === "object" && "status" in error ? `${error.status}` : "Unknown error"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Requests Management</h1>
          <p className="text-muted-foreground">Manage deposit and withdrawal requests</p>
        </div>
        <div className="flex items-center gap-2">
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

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <RequestsTable
            requests={filteredRequests}
            isLoading={isLoading}
            processingRequestId={processingRequestId}
            isUpdatingStatus={isUpdatingStatus}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>
        <TabsContent value="deposits" className="mt-6">
          <RequestsTable
            requests={filteredRequests}
            isLoading={isLoading}
            processingRequestId={processingRequestId}
            isUpdatingStatus={isUpdatingStatus}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>
        <TabsContent value="withdrawals" className="mt-6">
          <RequestsTable
            requests={filteredRequests}
            isLoading={isLoading}
            processingRequestId={processingRequestId}
            isUpdatingStatus={isUpdatingStatus}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface RequestsTableProps {
  requests?: any[]
  isLoading: boolean
  processingRequestId: string | null
  isUpdatingStatus: boolean
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

function RequestsTable({
  requests,
  isLoading,
  processingRequestId,
  isUpdatingStatus,
  onApprove,
  onReject,
}: RequestsTableProps) {
  return (
    <div className="rounded-md border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
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
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-28" />
                </TableCell>
              </TableRow>
            ))
          ) : !requests || requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No requests found.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.username}</TableCell>
                <TableCell>
                  <span className="flex items-center">
                    {request.type === "deposit" ? (
                      <ArrowDownCircle className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowUpCircle className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    <span className="capitalize">{request.type}</span>
                  </span>
                </TableCell>
                <TableCell className="font-mono">${request.amount.toLocaleString()}</TableCell>
                <TableCell className="hidden md:table-cell">{format(new Date(request.createdAt), "PPP")}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      request.status === "approved" &&
                        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                      request.status === "pending" &&
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                      request.status === "rejected" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
                    )}
                  >
                    {request.status}
                  </span>
                </TableCell>
                <TableCell>
                  {request.status === "pending" ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                        onClick={() => onApprove(request.id)}
                        disabled={isUpdatingStatus || processingRequestId === request.id}
                      >
                        {processingRequestId === request.id ? (
                          "Processing..."
                        ) : (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        onClick={() => onReject(request.id)}
                        disabled={isUpdatingStatus || processingRequestId === request.id}
                      >
                        {processingRequestId === request.id ? (
                          "Processing..."
                        ) : (
                          <>
                            <X className="mr-1 h-3 w-3" />
                            Reject
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="h-8">
                      View Details
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
