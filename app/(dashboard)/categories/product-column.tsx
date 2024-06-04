import Image from 'next/image';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useOpenProduct } from '@/features/products/hooks/use-open-product';

type Props = {
  products: {
    id: string;
    name: string;
    img: string;
  }[];
};

export const ProductColumn = ({ products }: Props) => {
  const { onOpen } = useOpenProduct();

  return (
    <div className="flex items-center gap-x-2">
      <TooltipProvider delayDuration={100}>
        {products.map((item) => (
          <Tooltip key={item.name}>
            <TooltipTrigger
              className="relative cursor-pointer"
              onClick={() => onOpen(item.id)}
              asChild
            >
              <Image
                src={item.img}
                alt={item.name}
                width={50}
                height={50}
                className="aspect-square rounded"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
