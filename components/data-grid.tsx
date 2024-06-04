'use client';

import { PiggyBank, BarChartBig } from 'lucide-react';
import { DataCard } from './data-card';
import { useSearchParams } from 'next/navigation';
import { formatDateRange } from '@/lib/utils';

export const DataGrid = () => {
  const params = useSearchParams();

  const to = params.get('to') || undefined;
  const from = params.get('from') || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Balance"
        value={401300}
        percentageChange={67}
        icon={PiggyBank}
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={72408}
        percentageChange={24}
        icon={BarChartBig}
        dateRange={dateRangeLabel}
      />
    </div>
  );
};
