"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { CategoryType } from "@/types/categories";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  onSuccess?: () => void;
};

const formSchema = z.object({
  details: z.string().min(1, "Details is required"),
  category_id: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
});

const fetcher = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", (await supabase
      .from("categories")
      .select("id")
      .eq("name", CategoryType.Income)
      .single()).data?.id);

  if (error) throw error;
  return data;
};

const accountsFetcher = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("accounts").select("*");
  if (error) throw error;
  return data;
};

export function IncomeModal({ onSuccess }: Props) {
  const [open, setOpen] = React.useState(false);
  const { slug: accountId } = useParams<{ slug: string }>();
  const [loading, setLoading] = React.useState(false);
  const supabase = createClient();

  const { data: incomeCategories = [] } = useSWR("income-categories", fetcher);
  const { data: accounts = [] } = useSWR("accounts", accountsFetcher);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      details: "",
      category_id: "",
      amount: "",
    },
  });

  const selectedAccount = React.useMemo(() => {
    return accounts.find((account) => account.id === accountId);
  }, [accounts, accountId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const amount = parseFloat(values.amount);

      const { error } = await supabase.from("transactions").insert({
        amount: amount, // Positive amount for income
        category_id: values.category_id,
        description: values.details,
        account_id: accountId,
      });

      if (error) throw error;

      if (selectedAccount) {
        const updatedBalance = selectedAccount.balance + amount;
        const { error: accountError } = await supabase
          .from("accounts")
          .update({ balance: updatedBalance })
          .eq("id", selectedAccount.id);

        if (accountError) throw accountError;
      }

      toast.success("Income added successfully");
      form.reset();
      setOpen(false);
      if (onSuccess) await onSuccess();
    } catch (error) {
      console.error("error", error);
      toast.error("An error occurred while adding income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="bg-green-600">
          <PlusCircle size={20} className="mr-2" />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add Income
            <Badge color="primary" className="ml-2">
              {selectedAccount?.name} (
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: selectedAccount?.currency || "USD",
              }).format(selectedAccount?.balance || 0)}
              )
            </Badge>
          </DialogTitle>
          <DialogDescription>Add a new income to your account</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Input placeholder="Income details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select income category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {incomeCategories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Amount</span>
                    {selectedAccount && (
                      <span className="text-sm text-muted-foreground">
                        in {selectedAccount.currency || "USD"}
                      </span>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save income"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
