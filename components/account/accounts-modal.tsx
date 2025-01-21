"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast as sonnerToast } from "sonner";
import { useToast } from "@/hooks/use-toast";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account } from "@/types/schema";
import { ToastAction } from "../ui/toast";
import { Button } from "../ui/button";
import { accountTypeOption, currenciesOption } from "@/constants/constant";
import { Switch } from "../ui/switch";
import { SelectGroup } from "@radix-ui/react-select";

type Props = {
  accountId?: string;
  type: "new" | "update";
  initialData?: Account | null;
  onComplete?: () => void;
};

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  // currency: z.object({ label: z.string(), value: z.string() }),
  currency: z.string(),
  account_type: z.enum(["bank", "cash", "mobile_money"]),
  amount_limit: z.number().min(0),
  is_active: z.boolean().optional(),
});

export function AccountsModal({ accountId, type, initialData, onComplete }: Props) {
  const { toast } = useToast();
  // console.log("accountId", accountId, "initialData", initialData);
  // console.log(form.getValues());
  const activeCurrency = currenciesOption.find((c) => c.value === initialData?.currency);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      // currency: activeCurrency || { label: "", value: "" },
      currency: initialData?.currency || "",
      account_type: initialData?.account_type || "bank",
      amount_limit: initialData?.amount_limit || 0,
      is_active: initialData?.is_active ?? true,
    },
  });

  console.log("error", form.formState.errors);

  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if(initialData) {
      form.setValue("account_type", initialData?.account_type as any);
      form.setValue("currency", initialData?.currency );
    }
  }, [initialData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const supabase = createClient();
      console.log("accountId", accountId);

      if (type === "new") {
        const { data: userData } = await supabase.auth.getUser();
        console.log("userData", userData);
        const { error } = await supabase.from("accounts").insert([
          {
            ...values,
            user_id: userData.user?.id,
            balance: 0,
            is_active: true,
          },
        ]);

        if (error) throw error;
        sonnerToast.success("Account created successfully");
      } else {
        console.log("accountId", accountId);
        const { error } = await supabase
          .from("accounts")
          .update(values)
          .eq("id", accountId);
        //   .select()

        if (error) throw error;
        sonnerToast.success("Account updated successfully");
      }

      // onComplete?.();
    } catch (error: any) {
      console.log("error", error);
      // toast.error("Something went wrong" + error?.message);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.message || "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      // console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialogContent className="w-[550px]">
      <AlertDialogHeader className="">
        <AlertDialogTitle className="text-2xl font-bold text-center mb-2">
          {type === "new" ? "Create a new account" : "Update account"}
        </AlertDialogTitle>
        <AlertDialogDescription className="text-sm text-muted-foreground mb-2">
          This is a modal to update or create a new account. You can set the account name,
          description, type and budget limit.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input {...form.register("name")} placeholder="Name of your account" />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                {...form.register("description")}
                placeholder="Account description (optional)"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="account_type">Type</Label>
              <Select
                value={form.watch("account_type")}
                onValueChange={(value) => form.setValue("account_type", value as any)}
              >
                <SelectTrigger>
                  <SelectValue>
                    {accountTypeOption.find(opt => opt.value === form.watch("account_type"))?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {accountTypeOption.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Select 
                value={form.watch("currency")}
                onValueChange={(value) => form.setValue("currency", value as string)}
              >
                <SelectTrigger>
                  <SelectValue>
                    {currenciesOption.find(opt => opt.value === form.watch("currency"))?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {currenciesOption.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount_limit">Budget limit</Label>
              <Input
                type="number"
                {...form.register("amount_limit", { valueAsNumber: true })}
                placeholder="Set a budget limit"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Switch
                // {...form.register("is_active")}
                checked={form.watch("is_active")}
                onCheckedChange={(value) => form.setValue("is_active", value)}
              />
              <Label htmlFor="is_active" className="flex items-center space-x-2">
                <span>Account Status</span>
              </Label>
            </div>
          </div>        </div>
        <AlertDialogFooter className="w-full flex align-center justify-between gap-3">
          <AlertDialogCancel className="">Cancel</AlertDialogCancel>
          <Button type="submit" disabled={loading} className="min-w-24">
            {loading ? "Processing..." : "Save"}
          </Button>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  );
}
