import { AccountType } from "@/types/schema";

export const accountTypeOption = [
  { label: "Bank Account", value: AccountType?.BANK },
  { label: "Mobile Money", value: AccountType?.MOBILE_MONEY },
  { label: "Cash", value: AccountType?.CASH },
];

export const currenciesOption = [
  { label: "USD", value: "USD" },
  { label: "GHS", value: "GHS" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "RWF", value: "RWF" },
  { label: "KES", value: "KES" },
  { label: "UGX", value: "UGX" },
  { label: "FCFA", value: "FCFA" },
];