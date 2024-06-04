'use client';

import { useState } from 'react';
import { useMedia } from 'react-use';
import { usePathname, useRouter } from 'next/navigation';

import { NavButton } from '@/components/nav-button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react';

const routes = [
  {
    href: '/',
    label: 'Overview',
  },
  {
    href: '/orders',
    label: 'Orders',
  },
  {
    href: '/products',
    label: 'Products',
  },
  {
    href: '/categories',
    label: 'Categories',
  },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMedia('(max-width: 1024px)', false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="font-normal bg-white/10 hover:bg-white/20 hover:text-white focus-visible:ring-offset-0 focus-visible:ring-transparent border-none outline-none focus:bg-white/30 text-white transition"
          >
            <PanelLeft className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="px-2">
          <nav className="flex flex-col gap-y-2 pt-6">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={route.href === pathname ? 'secondary' : 'ghost'}
                onClick={() => onClick(route.href)}
                className="w-full justify-start"
              >
                {route.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route) => (
        <NavButton
          key={route.href}
          label={route.label}
          href={route.href}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};
