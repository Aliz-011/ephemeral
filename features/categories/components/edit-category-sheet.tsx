import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { CategoryForm } from '@/features/categories/components/category-form';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';
import { useEditCategory } from '@/features/categories/api/use-edit-category';
import { useGetCategory } from '@/features/categories/api/use-get-category';
import { useConfirm } from '@/hooks/use-confirm';

import { insertCategorySchema } from '@/db/schema';

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this account'
  );

  const categoryQuery = useGetCategory(id);
  const deleteMutation = useDeleteCategory(id);
  const editMutations = useEditCategory(id);

  const isPending = deleteMutation.isPending || editMutations.isPending;
  const isLoading = categoryQuery.isLoading;

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

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
      }
    : {
        name: '',
      };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit category</SheetTitle>
            <SheetDescription>Edit an existing category</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="text-muted-foreground animate-none size-4" />
            </div>
          ) : (
            <CategoryForm
              id={id}
              defaultValues={defaultValues}
              onDelete={onDelete}
              onSubmit={onSubmit}
              disabled={isPending}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
