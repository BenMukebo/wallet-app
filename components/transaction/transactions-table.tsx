"use client";
import { useState } from "react";
import { DataTable } from "../tables/data-table";
import { transactionColumns } from "../tables/columns";
import { TransactionDetails } from "./transaction-details";
import { Dialog } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionsModal from "./transactions-modal";
import { PlusCircle } from "lucide-react";
import { useTransactions, useCategories } from "@/lib/hooks";
import { useParams } from "next/navigation";
import { Transaction } from "@/types/schema";
import { IncomeModal } from "./income-modal";

export function TransactionsTable() {
  const { slug: accountId } = useParams<{ slug: string }>();
  const { data: transactions = [], mutate } = useTransactions(accountId);
  const { data: categories = [] } = useCategories();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredData =
    categoryFilter === "all"
      ? transactions
      : transactions.filter((t) => t.categories?.parent_id === categoryFilter);

  const columns = transactionColumns(setSelectedTransaction, setIsDetailsOpen);

  return (
    <div>
      <div className="mb-4">
        <Select onValueChange={setCategoryFilter} defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        searchKey="description"
        renderHeaderActions={() => (
          <div className="flex gap-2">
            <TransactionsModal onSuccess={() => mutate()} />
            <IncomeModal onSuccess={() => mutate()} />
          </div>
        )}
      />

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <TransactionDetails transaction={selectedTransaction} />
      </Dialog>
    </div>
  );
}
