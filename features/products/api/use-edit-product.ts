import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';

type ResponseType = InferResponseType<
  (typeof client.api.products)[':id']['$patch']
>;
type RequestType = InferRequestType<
  (typeof client.api.products)[':id']['$patch']
>['json'];

export const useEditProduct = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.products[':id'].$patch({
        json,
        param: { id },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch product');
      }

      return await res.json();
    },
    onSuccess: () => {
      toast.success('Product updated.');
      queryClient.invalidateQueries({ queryKey: ['product', { id }] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast.error('Failed updating product');
    },
  });

  return mutation;
};
