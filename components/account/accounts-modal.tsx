"use client"
import React from 'react';
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod"
import { toast } from "sonner"
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Account, AccountType } from '@/types/schema'

type Props = {
  accountId?: string;
  type: 'new' | 'update';
  initialData?: Account | null;
  onComplete?: () => void;
}

const accountTypeOption = [
  { label: "Bank Account", value: AccountType?.BANK },
  { label: "Mobile Money", value: AccountType?.MOBILE_MONEY },
  { label: "Cash", value: AccountType?.CASH }
]

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  account_type: z.enum(['bank', 'cash', 'mobile_money']),
  amount_limit: z.number().min(0),
})

export function AccountsModal({ accountId, type, initialData, onComplete }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      account_type: initialData?.account_type || "bank",
      amount_limit: initialData?.amount_limit || 0,
    },
  })

  const [loading, setLoading] = React.useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      const supabase = createClient()
      
      if (type === 'new') {
        const { data: userData } = await supabase.auth.getUser()
        const { error } = await supabase
          .from('accounts')
          .insert([{
            ...values,
            user_id: userData.user?.id,
            balance: 0,
            is_active: true,
          }])
        
        if (error) throw error
        toast.success("Account created successfully")
      } else {
        const { error } = await supabase
          .from('accounts')
          .update(values)
          .eq('id', accountId)
        
        if (error) throw error
        toast.success("Account updated successfully")
      }
      
      onComplete?.()
    } catch (error) {
      toast.error("Something went wrong")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialogContent className="w-[550px]">
      <AlertDialogHeader>
        <AlertDialogTitle>
          {type === 'new' ? 'Create a new account' : 'Update account'}
        </AlertDialogTitle>
        <AlertDialogDescription>
          This is a modal to update or create a new account. You can set the account name, description, type and budget limit.         
        </AlertDialogDescription>
      </AlertDialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-6">
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input 
                {...form.register("name")}
                placeholder="Name of your account" 
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
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
              <Select onValueChange={(value) => form.setValue("account_type", value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
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
              <Label htmlFor="amount_limit">Budget limit</Label>
              <Input 
                type="number"
                {...form.register("amount_limit", { valueAsNumber: true })}
                placeholder="Set a budget limit" 
              />
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type="submit" disabled={loading}>
            {loading ? "Processing..." : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </form>
    </AlertDialogContent>
  )
}
