'use client';

import { Loader2, Plus } from 'lucide-react';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { columns } from './columns';

import { useGetProducts } from '@/features/products/api/use-get-products';
import { useNewProduct } from '@/features/products/hooks/use-new-product';

const ProductPage = () => {
  const { onOpen } = useNewProduct();
  const productsQuery = useGetProducts();
  const products = productsQuery.data || [];

  if (productsQuery.isLoading) {
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
          <CardTitle className="text-2xl">Products page</CardTitle>
          <Button size="sm" onClick={onOpen}>
            <Plus className="size-4 mr-2" />
            New product
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable data={products} columns={columns} filterKey="name" />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductPage;
