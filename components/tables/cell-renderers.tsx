"use client"

import { format } from "date-fns"

export function DateCell({ value }: { value: string }) {
  return <div>{format(new Date(value), 'PPP')}</div>
}

export function CurrencyCell({ amount }: { amount: number }) {
  return (
    <div>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)}
    </div>
  )
}
