import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';

export const useGetProducts = () => {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await client.api.products.$get();

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const { data } = await res.json();

      return data.map((product) => ({
        ...product,
        price: convertAmountFromMiliunits(product.price),
      }));
    },
  });

  return query;
};
