"use client"
import React, { useState } from 'react'
import { DataTable } from '../tables/data-table'
import { accountColumns } from '../tables/columns'
import { Account } from '@/types/schema'
import { Button } from '../ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from '../ui/alert-dialog'
import { AccountsModal } from './accounts-modal'

interface Props {
  data: Account[]
}

const AccountsTable = ({ data }: Props) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const columns = React.useMemo(
    () => accountColumns(setSelectedAccount, setIsModalOpen),
    []
  )

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline"
             onClick={() => setIsModalOpen(true)}
             
            >New Account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AccountsModal 
              type={selectedAccount ? 'update' : 'new'} 
              accountId={selectedAccount?.id}
              initialData={selectedAccount}
              onComplete={() => {
                setIsModalOpen(false)
                setSelectedAccount(null)
              }}
            />
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="name"
      />
    </div>
  )
}

export default AccountsTable