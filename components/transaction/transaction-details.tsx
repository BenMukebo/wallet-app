"use client"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { Transaction } from "@/types/schema"

interface TransactionDetailsProps {
  transaction: Transaction | null;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  if (!transaction) return null;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Transaction Details</DialogTitle>
        <DialogDescription>
          Full details of the transaction
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Amount:</div>
            <div>{new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(transaction.amount)}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Date:</div>
            <div>{format(new Date(transaction.transaction_date), 'PPP HH:mm')}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Description:</div>
            <div>{transaction.description}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Transaction ID:</div>
            <div className="truncate">{transaction.id}</div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
