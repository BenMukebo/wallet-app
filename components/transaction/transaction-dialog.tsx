"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Transaction } from "@/types/schema"
import { format } from "date-fns"

interface TransactionDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDialog({ transaction, open, onOpenChange }: TransactionDialogProps) {
  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Transaction ID: {transaction.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Amount</p>
              <p className="text-lg font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(transaction.amount)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Date</p>
              <p>{format(new Date(transaction.transaction_date), 'PPP')}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Description</p>
            <p>{transaction.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
