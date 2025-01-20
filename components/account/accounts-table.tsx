"use client"
import React from 'react'
import { DataTable } from '../tables/data-table'
import { accountColumns } from '../tables/columns'
import { Account } from '@/types/schema'

interface AccountsTableProps {
  data: Account[]
}

const AccountsTable = ({ data }: AccountsTableProps) => {
  return (
    <div>
      <DataTable 
        columns={accountColumns} 
        data={data} 
        searchKey="name"
      />
    </div>
  )
}

export default AccountsTable