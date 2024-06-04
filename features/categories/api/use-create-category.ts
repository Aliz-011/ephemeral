import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/hono';
import { toast } from 'sonner';

export type ResponseType = InferResponseType<
  typeof client.api.categories.$post
>;
type RequestType = InferRequestType<typeof client.api.categories.$post>['json'];

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.categories.$post({ json });

      return await res.json();
    },
    onSuccess: () => {
      toast.success('Category created.');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      toast.error('Failed to create category');
    },
  });

  return mutation;
};
