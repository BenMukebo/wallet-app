import { createClient } from "@/utils/supabase/client";
import useSWR from "swr";

const supabase = createClient();

export function useUserProfile(userId: string) {
  return useSWR(["userProfile", userId], async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  });
}

export function useAccounts(userId: string) {
  return useSWR(["accounts", userId], async () => {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data || [];
  });
}

export function useAccount(accountId: string) {
  return useSWR(["account", accountId], async () => {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    if (error) throw error;
    return data;
  });
}


export function useCategories() {
  return useSWR("categories", async () => {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) throw error;
    return data || [];
  });
}

export function useTransactions(accountId: string) {
  return useSWR(["transactions", accountId], async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        *,
        categories (
          id,
          name,
          parent_id
        )
      `
      )
      .eq("account_id", accountId);

    if (error) throw error;
    return data || [];
  });
}
