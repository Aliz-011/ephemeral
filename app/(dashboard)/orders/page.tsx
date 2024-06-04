'use client';

import { Loader2, Plus } from 'lucide-react';

import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { columns } from './columns';
import { useGetOrders } from '@/features/orders/api/use-get-orders';

const OrdersPage = () => {
  const orderQuery = useGetOrders();
  const orders = orderQuery.data || [];

  if (orderQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="animate-spin size-4 text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-2xl">Orders page</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={orders} columns={columns} filterKey="name" />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;
