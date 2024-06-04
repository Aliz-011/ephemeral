import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/hono';
import { convertAmountFromMiliunits } from '@/lib/utils';

export const useGetOrder = (id?: string) => {
  const query = useQuery({
    queryKey: ['order', { id }],
    queryFn: async () => {
      const res = await client.api.orders[':id'].$get({ param: { id } });

      if (!res.ok) {
        throw new Error('Failed to fetch order');
      }

      const { data } = await res.json();

      return { ...data, total: convertAmountFromMiliunits(data.total) };
    },
  });

  return query;
};
