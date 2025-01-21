"use client";
import React from "react";
import useSWR from "swr";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { fetchCategories } from "@/actions/categories";
import { createClient } from "@/utils/supabase/client";
import { CategoryType } from "@/types/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { Badge } from "../ui/badge";

type Props = {
  onSuccess?: () => void;
};

type Category = {
  id: string;
  name: string;
  parent_id: string | null;
  user_id: string | null;
};

type CategoryWithChildren = Category & {
  children: CategoryWithChildren[];
};

const buildCategoryTree = (categories: Category[]): CategoryWithChildren[] => {
  const categoryMap = new Map<string, CategoryWithChildren>();
  const rootCategories: CategoryWithChildren[] = [];

  categories.forEach((category) => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  categories.forEach((category) => {
    const categoryWithChildren = categoryMap.get(category.id)!;

    if (category.parent_id === null) {
      rootCategories.push(categoryWithChildren);
    } else {
      const parent = categoryMap.get(category.parent_id);
      if (parent) {
        parent.children.push(categoryWithChildren);
      }
    }
  });

  return rootCategories;
};

const fetcher = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    throw error;
  }

  return data;
};

const accountsFetcher = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("accounts").select("*");

  if (error) {
    throw error;
  }

  return data;
};

const formSchema = z.object({
  details: z.string().min(1, "Details is required"),
  category_id: z.string().min(1, "Category is required"),
  amount: z.string().min(1, "Amount is required"),
});

const TransactionsModal = ({ onSuccess }: Props) => {
  const [open, setOpen] = React.useState(false);
  const { slug: accountId } = useParams<{ slug: string }>();
  const [loading, setLoading] = React.useState(false);
  const supabase = createClient();

  const {
    data: flatCategories = [],
    isLoading,
    error,
  } = useSWR("categories", () => fetcher());

  const { data: accounts = [] } = useSWR("accounts", () => accountsFetcher());

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
      if (
        selectedAccount &&
        selectedAccount.balance < parseFloat(values.amount)
      ) {
        toast.error("Insufficient balance in the selected account");
        return;
      }

      const { error } = await supabase.from("transactions").insert({
        amount: values.amount,
        category_id: values.category_id,
        description: values.details,
        account_id: accountId,
      });

      if (error) {
        throw error;
      }

      if (selectedAccount) {
        const updatedBalance =
          selectedAccount.balance - parseFloat(values.amount);
        const { error: accountError } = await supabase
          .from("accounts")
          .update({ balance: updatedBalance })
          .eq("id", selectedAccount.id);

        if (accountError) {
          throw accountError;
        }
      }

      toast.success("Transaction added successfully");
      form.reset();
      setOpen(false); // Close the dialog after successful submission

      // Call the refresh function after successful submission
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.log("error", error);
      toast.error("An error occurred while adding transaction");
    } finally {
      setLoading(false);
    }
  };

  const categoryTree = React.useMemo(
    () => buildCategoryTree(flatCategories),
    [flatCategories]
  );

  const expensesCategories = categoryTree.find(
    (c) => c.name === CategoryType.Expense
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle size={20} className="mr-2" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add Transaction
            <Badge color="primary" className="ml-2">
              {selectedAccount?.name} (
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: selectedAccount?.currency || "USD",
              }).format(selectedAccount?.balance || 0)}
              )
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Add a new transaction to your account
          </DialogDescription>
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
                    <Input placeholder="Transaction details" {...field} />
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
                        <SelectValue
                          placeholder="Select a category"
                          className="capitalize"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expensesCategories?.children.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="capitalize"
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
                {loading ? "Saving..." : "Save transaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionsModal;
