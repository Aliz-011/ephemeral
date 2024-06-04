import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';

export const useGetProduct = (id?: string) => {
  const query = useQuery({
    queryKey: ['product', { id }],
    queryFn: async () => {
      const res = await client.api.products[':id'].$get({ param: { id } });

      if (!res.ok) {
        throw new Error('Failed to fetch product');
      }

      const { data } = await res.json();

      return { ...data, price: convertAmountFromMiliunits(data.price) };
    },
  });

  return query;
};
