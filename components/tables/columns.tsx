"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Account, Transaction } from "@/types/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "../ui/badge";
import { format } from "path";
import { CategoryType } from "@/types/categories";

export const accountColumns = (
  setSelectedAccount: (account: Account) => void,
  setIsModalOpen: (open: boolean) => void
): ColumnDef<Account>[] => [
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
  // {
  //   accessorKey: "description",
  //   header: "Description",
  //   cell: ({ row }) => {
  //     const description = row.getValue("description") as string;
  //     return <div>{description || "No description provided"}</div>;
  //   },
  // },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const account = row.original;
      const amountLimit = row.getValue("amount_limit") as number;
      return `${amountLimit} ${account.currency.toUpperCase()}`;
    },
    // cell: ({ row }) => {
    //   const amount = parseFloat(row.getValue("balance"))
    //   const account = row.original
    //   return new Intl.NumberFormat("en-US", {
    //     style: "currency",
    //     currency: account.currency || "USD",
    //   }).format(amount)
    // },
  },
  {
    accessorKey: "account_type",
    header: "Type",
    cell: ({ row }) => {
      const accountType = row.getValue("account_type") as string;
      return <span className="capitalize">{accountType}</span>;
    }
  },
  {
    accessorKey: "amount_limit",
    header: "Budget not to exceed",
  },
  {
    accessorKey: "currency",
    header: "currency",
  },
  {
    accessorKey: "created_at",
    header: "Create Date",
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString();
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active") as boolean;
      // return isActive ? "Active" : "Inactive"
      return isActive ? (
        <Badge variant="outline">Active</Badge>
      ) : (
        <Badge variant="destructive">Inactive</Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const account = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild className="cursor-pointer text-xs font-medium">
              <Link href={`/protected/accounts/${account.id}/transactions`}>
                View Transactions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedAccount(account);
                setIsModalOpen(true);
              }}
              className="cursor-pointer text-xs font-medium"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(account.id)}
              className="cursor-pointer text-xs font-medium"
            >
              Copy ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export const transactionColumns = (
  setSelectedTransaction: (transaction: Transaction) => void,
  setIsDetailsOpen: (open: boolean) => void
): ColumnDef<Transaction>[] => [
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Description
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString(),
  },
  {
    accessorKey: "categories.name",
    header: "Category",
  },
  {
    accessorKey: "categories.parent_id",
    header: "Type",
    cell: ({ row }) => {
      const category = row.original.categories;
      const type = category?.parent_id === "5f095b03-5dd8-442a-a08d-004241f0f5d8" ? "Expense" : "Income";
      return (
        <Badge variant={type === "Expense" ? "destructive" : "secondary"} className={type === "Income" ? "bg-green-600" : ""}>
          {type}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;
      return (
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedTransaction(transaction);
            setIsDetailsOpen(true);
          }}
        >
          View Details
        </Button>
      );
    },
  },
];
