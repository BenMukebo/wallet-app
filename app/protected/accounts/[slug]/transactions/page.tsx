"use client";
import React from "react";
import { useTransactions, useAccount, useCategories } from "@/lib/hooks";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/components/transaction/transactions-table";
import { CategoryType } from "@/types/categories";

export default function TransactionsPage() {
  const { slug: accountId } = useParams<{ slug: string }>();
  const { data: account } = useAccount(accountId);
  const { data: transactions } = useTransactions(accountId);
  const { data: categories } = useCategories();

  const incomeParentId = categories?.find(
    (c) => c.name.toLowerCase() === CategoryType.Income
  )?.id;
  const expenseParentId = categories?.find(
    (c) => c.name.toLowerCase() === CategoryType.Expense
  )?.id;

  const incomeTransactions = (transactions || []).filter(
    (t) => t.categories?.parent_id === incomeParentId
  );

  const expenseTransactions = (transactions || []).filter(
    (t) => t.categories?.parent_id === expenseParentId
  );

  const totalIncome = incomeTransactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  const totalExpense = expenseTransactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: account?.currency || "USD",
              }).format(account?.balance || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: account?.currency || "USD",
              }).format(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: account?.currency || "USD",
              }).format(totalExpense)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <TransactionsTable
          data={transactions || []}
          categories={categories || []}
        />
      </div>
    </div>
  );
}
