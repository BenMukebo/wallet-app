import React from 'react';
import { createClient } from "@/utils/supabase/server";
import AccountsTable from '@/components/account/accounts-table';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounts } from '@/lib/hooks';

const AccountsPage = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // const [accountsData, categoriesData] = await Promise.all([
  //   supabase.from('accounts').select('*').eq('user_id', user?.id),
  //   supabase.from('categories').select('*').eq('user_id', user?.id)
  // ]);

  const { data: accountsData } = await supabase.from('accounts').select('*').eq('user_id', user?.id);
  const totalBalance = accountsData?.reduce((acc, account) => acc + account.balance, 0) || 0;

  return (
    <div className="mx-auto py-10">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(totalBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <AccountsTable userId={user?.id!} data={accountsData || []} />
    </div>
  )
}

export default AccountsPage