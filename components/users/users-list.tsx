"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal, Search, Users } from "lucide-react"
import { useGetUsersQuery, useUpdateUserDepositMutation, useToggleTradeWinMutation } from "@/lib/api/users-api-slice"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

export function UsersList() {
  const { data: users, isLoading, error } = useGetUsersQuery()
  const [updateUserDeposit, { isLoading: isUpdatingDeposit }] = useUpdateUserDepositMutation()
  const [toggleTradeWin, { isLoading: isTogglingTradeWin }] = useToggleTradeWinMutation()

  const [depositDialogOpen, setDepositDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState("")
  const [depositAmount, setDepositAmount] = useState(0)

  const handleUpdateDeposit = (userId: number) => {
    setSelectedUserId(userId.toString())
    const user = users?.find((u) => u.id === userId)
    if (user) {
      setDepositAmount(user.cash)
    }
    setDepositDialogOpen(true)
  }

  const handleSaveDeposit = async () => {
    try {
      await updateUserDeposit({ userId: selectedUserId, amount: depositAmount }).unwrap()
      toast({
        title: "Deposit Updated",
        description: "User deposit has been updated successfully.",
      })
      setDepositDialogOpen(false)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update deposit. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleTradeWin = async (userId: number, currentValue: boolean) => {
    try {
      await toggleTradeWin({ userId, enabled: !currentValue }).unwrap()
      toast({
        title: "Trade Win Setting Updated",
        description: `Trade win has been ${!currentValue ? "enabled" : "disabled"} for this user.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update trade win setting. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading users: {typeof error === "object" && "status" in error ? `${error.status}` : "Unknown error"}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Users Management</h1>
          <p className="text-muted-foreground">View and manage platform users</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Trade Win</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? // Loading skeleton
                [...Array(3)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-12" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-28" />
                    </TableCell>
                  </TableRow>
                ))
              : users?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="font-mono">${user.cash}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.trade_win}
                          onCheckedChange={() => handleToggleTradeWin(user.id, user.trade_win)}
                          disabled={isTogglingTradeWin}
                        />
                        <span className="text-xs text-muted-foreground">{user.trade_win ? "On" : "Off"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateDeposit(user.id)}>
                          Update Deposit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update User Deposit</DialogTitle>
            <DialogDescription>Change the deposit amount for this user. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deposit">Deposit Amount</Label>
              <div className="flex items-center">
                <span className="mr-2 text-muted-foreground">$</span>
                <Input
                  id="deposit"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="font-mono"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDepositDialogOpen(false)} disabled={isUpdatingDeposit}>
              Cancel
            </Button>
            <Button onClick={handleSaveDeposit} disabled={isUpdatingDeposit}>
              {isUpdatingDeposit ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
