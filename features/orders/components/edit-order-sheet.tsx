import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

import { useOpenProduct } from '@/features/products/hooks/use-open-product';
import { ProductForm } from '@/features/products/components/product-form';
import { useDeleteProduct } from '@/features/products/api/use-delete-product';
import { useEditProduct } from '@/features/products/api/use-edit-product';
import { useGetProduct } from '@/features/products/api/use-get-product';
import { useConfirm } from '@/hooks/use-confirm';

import { insertProductSchema } from '@/db/schema';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useCreateCategory } from '@/features/categories/api/use-create-category';

const formSchema = insertProductSchema.omit({
  id: true,
  createdAt: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditOrderSheet = () => {
  const { isOpen, onClose, id } = useOpenProduct();
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this order'
  );

  const productQuery = useGetProduct(id);
  const deleteMutation = useDeleteProduct(id);
  const editMutations = useEditProduct(id);

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.name,
  }));

  const isPending =
    deleteMutation.isPending ||
    editMutations.isPending ||
    categoryQuery.isPending;
  const isLoading = productQuery.isLoading || categoryQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutations.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  const defaultValues = productQuery.data
    ? {
        name: productQuery.data.name,
        description: productQuery.data.description,
        categoryId: productQuery.data.categoryId,
        price: productQuery.data.price.toString(),
        img: productQuery.data.img,
      }
    : {
        name: '',
        description: '',
        categoryId: '',
        price: '',
        img: '',
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit product</SheetTitle>
            <SheetDescription>Edit an existing product</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="text-muted-foreground animate-none size-4" />
            </div>
          ) : (
            <ProductForm
              id={id}
              defaultValues={defaultValues}
              categoryOptions={categoryOptions}
              onDelete={onDelete}
              onSubmit={onSubmit}
              onCreateCategory={onCreateCategory}
              disabled={isPending}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
