import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';

export const useGetOrders = () => {
  const query = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await client.api.orders.$get();

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const { data } = await res.json();

      return data.map((order) => ({
        ...order,
        total: convertAmountFromMiliunits(order.total),
      }));
    },
  });

  return query;
};
