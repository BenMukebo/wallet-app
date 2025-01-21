export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export enum AccountType {
  BANK = "bank",
  CASH = "cash",
  MOBILE_MONEY = "mobile_money",
}

export type Account = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  account_type: AccountType;
  balance: number;
  currency: string;
  amount_limit: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  user_id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  amount: number;
  transaction_date: string;
  description: string;
  created_at: string;
  updated_at: string;
  categories?: Category;
};

export type Budget = {
  id: string;
  user_id: string;
  category_id: string;
  amount_limit: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
