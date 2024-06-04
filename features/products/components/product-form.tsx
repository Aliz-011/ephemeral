import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TrashIcon } from '@radix-ui/react-icons';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { AmountInput } from '@/components/amount-input';
import { Select } from '@/components/select';

import { insertProductSchema } from '@/db/schema';
import { convertAmountToMiliunits } from '@/lib/utils';
import { useEdgeStore } from '@/lib/edgestore';
import { SingleImageDropzone } from '@/components/single-image-dropzone';

const formSchema = z.object({
  name: z.string(),
  price: z.string(),
  img: z.string(),
  categoryId: z.string(),
  description: z.string().nullable().optional(),
});

const apiSchema = insertProductSchema.omit({
  id: true,
  createdAt: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  categoryOptions: {
    label: string;
    value: string;
  }[];
  disabled?: boolean;
  onCreateCategory: (name: string) => void;
};

export const ProductForm = ({
  onSubmit,
  defaultValues,
  disabled,
  id,
  onDelete,
  categoryOptions,
  onCreateCategory,
}: Props) => {
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onClose = () => {
    setIsSubmitting(false);
    setFile(undefined);
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: defaultValues?.img ? defaultValues.img : undefined,
        },
      });

      form.setValue('img', res.url);

      onClose();
    }
  };

  const handleSubmit = (values: FormValues) => {
    const price = parseFloat(values.price);
    const priceMiliunits = convertAmountToMiliunits(price);

    onSubmit({
      ...values,
      price: priceMiliunits,
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="img"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <SingleImageDropzone
                  className="w-full outline-none"
                  disabled={isSubmitting}
                  value={file ? file : field.value}
                  onChange={onChange}
                  dropzoneOptions={{
                    maxSize: 1024 * 1024 * 4,
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={disabled} placeholder="e.g. Beef" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select a category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  disabled={disabled}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="price"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  disabled={disabled}
                  placeholder="Description of product"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disabled || isSubmitting}>
          {id ? 'Save changes' : 'Create product'}
        </Button>
        {!!id && (
          <Button
            type="button"
            onClick={handleDelete}
            className="w-full"
            size="sm"
            variant="outline"
          >
            <TrashIcon className="size-4 mr-2" />
            Delete product
          </Button>
        )}
      </form>
    </Form>
  );
};
