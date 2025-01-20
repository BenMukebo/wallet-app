import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { Account, Transaction } from "@/types/schema"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

export const accountColumns: ColumnDef<Account>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Account Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string
      return <div>{description || "No description provided"}</div>
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("balance"))
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    },
  },
  {
    accessorKey: "account_type",
    header: "Type",
  },
  {
    accessorKey: "created_at",
    header: "Create Date",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/protected/accounts/${account.id}/transactions`}>
                View Transactions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(account.id)}>
              Copy ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    },
  },
  {
    accessorKey: "transaction_date",
    header: "Date",
    cell: ({ row }) => {
      return new Date(row.getValue("transaction_date")).toLocaleDateString()
    },
  },
  {
    accessorKey: "categories.name",
    header: "Category",
  },
]
