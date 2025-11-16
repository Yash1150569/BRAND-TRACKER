'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { AnalyzedMention } from '@/lib/types';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

type SentimentChartProps = {
  mentions: AnalyzedMention[];
  className?: string;
};

const chartConfig = {
  positive: {
    label: 'Positive',
    color: 'hsl(var(--chart-2))',
  },
  negative: {
    label: 'Negative',
    color: 'hsl(var(--chart-3))',
  },
  neutral: {
    label: 'Neutral',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig;

export function SentimentChart({ mentions, className }: SentimentChartProps) {
  const chartData = useMemo(() => {
    const dataByDay: { [key: string]: { positive: number; negative: number; neutral: number } } = {};

    mentions.forEach((mention) => {
      const day = format(parseISO(mention.timestamp), 'MMM d');
      if (!dataByDay[day]) {
        dataByDay[day] = { positive: 0, negative: 0, neutral: 0 };
      }
      dataByDay[day][mention.sentiment]++;
    });

    return Object.entries(dataByDay)
      .map(([day, sentiments]) => ({ day, ...sentiments }))
      .reverse();
  }, [mentions]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sentiment Over Time</CardTitle>
        <CardDescription>
          Sentiment of analyzed mentions from the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="positive" fill="var(--color-positive)" radius={4} />
              <Bar dataKey="negative" fill="var(--color-negative)" radius={4} />
              <Bar dataKey="neutral" fill="var(--color-neutral)" radius={4} />
            </BarChart>
          </ChartContainer>
        ) : (
            <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                No data to display.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
