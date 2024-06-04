import Image from 'next/image';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type Props = {
  orderItems: {
    orderId: string;
    quantity: number;
    product: {
      name: string;
      img: string;
    };
  }[];
};

export const OrderItemsColumn = ({ orderItems }: Props) => {
  return (
    <div className="flex items-center gap-x-2">
      {orderItems.map((item) => (
        <TooltipProvider key={item.product.name}>
          <Tooltip>
            <TooltipTrigger className="relative" asChild>
              <Image
                src={item.product.img}
                alt={item.product.name}
                width={50}
                height={50}
                className="aspect-square rounded"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.product.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};
