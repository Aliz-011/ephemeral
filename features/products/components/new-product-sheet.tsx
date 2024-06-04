import { z } from 'zod';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useNewProduct } from '@/features/products/hooks/use-new-product';
import { ProductForm } from '@/features/products/components/product-form';
import { useCreateProduct } from '@/features/products/api/use-create-product';
import { useGetCategories } from '@/features/categories/api/use-get-categories';

import { insertProductSchema } from '@/db/schema';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { Loader2 } from 'lucide-react';

const formSchema = insertProductSchema.omit({
  id: true,
  createdAt: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewProductSheet = () => {
  const { isOpen, onClose } = useNewProduct();

  const productMutation = useCreateProduct();
  const categoryMutation = useCreateCategory();

  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryQuery = useGetCategories();
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const isPending = productMutation.isPending || categoryMutation.isPending;
  const isLoading = categoryQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    productMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New product</SheetTitle>
          <SheetDescription>Create a new product</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-muted-foreground size-4" />
          </div>
        ) : (
          <ProductForm
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={onCreateCategory}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
