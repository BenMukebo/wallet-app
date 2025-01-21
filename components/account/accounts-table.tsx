"use client";
import React, { useState } from "react";
import { DataTable } from "../tables/data-table";
import { accountColumns } from "../tables/columns";
import { Account } from "@/types/schema";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { AccountsModal } from "./accounts-modal";
import { PlusCircle } from "lucide-react";
import { useAccounts } from "@/lib/hooks";

interface Props {
  userId: string;
  data: Account[];
}

const AccountsTable = ({ userId, data }: Props) => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: accountsData = [], mutate } = useAccounts(userId);

  const columns = React.useMemo(
    () => accountColumns(setSelectedAccount, setIsModalOpen),
    []
  );

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button variant="default" onClick={() => setIsModalOpen(true)}>
              <PlusCircle size={20} className="mr-2" />
              New Account
            </Button>
          </DialogTrigger>
          <AccountsModal
            type={selectedAccount ? "update" : "new"}
            accountId={selectedAccount?.id}
            initialData={selectedAccount}
            onComplete={() => {
              mutate();
              setIsModalOpen(false);
              setSelectedAccount(null);
            }}
          />
        </Dialog>
      </div>

      <DataTable columns={columns} data={accountsData} searchKey="name" />
    </div>
  );
};

export default AccountsTable;
