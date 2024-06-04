'use client';

import { useMountedState } from 'react-use';

import { NewCategorySheet } from '@/features/categories/components/new-category-sheet';
import { EditCategorySheet } from '@/features/categories/components/edit-category-sheet';

import { NewProductSheet } from '@/features/products/components/new-product-sheet';
import { EditProductSheet } from '@/features/products/components/edit-product-sheet';

export const SheetProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) return null;

  return (
    <>
      <NewCategorySheet />
      <EditCategorySheet />

      <NewProductSheet />
      <EditProductSheet />
    </>
  );
};
