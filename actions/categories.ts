"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchCategories = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    throw error;
  }

  return data;
};
