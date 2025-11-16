'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Frown, Meh, MessagesSquare, Smile } from 'lucide-react';
import type { AnalyzedMention } from '@/lib/types';
import { useMemo } from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
};

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

type StatCardsProps = {
  analyzedMentions: AnalyzedMention[];
  totalMentions: number;
};

export function StatCards({ analyzedMentions, totalMentions }: StatCardsProps) {
  const stats = useMemo(() => {
    let positive = 0;
    let negative = 0;
    let neutral = 0;

    for (const mention of analyzedMentions) {
      if (mention.sentiment === 'positive') positive++;
      else if (mention.sentiment === 'negative') negative++;
      else neutral++;
    }

    return { positive, negative, neutral };
  }, [analyzedMentions]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Mentions"
        value={totalMentions}
        icon={<MessagesSquare className="h-4 w-4 text-muted-foreground" />}
        description="Across all platforms"
      />
      <StatCard
        title="Positive"
        value={stats.positive}
        icon={<Smile className="h-4 w-4 text-green-500" />}
        description="Positive sentiment mentions"
      />
      <StatCard
        title="Negative"
        value={stats.negative}
        icon={<Frown className="h-4 w-4 text-red-500" />}
        description="Negative sentiment mentions"
      />
      <StatCard
        title="Neutral"
        value={stats.neutral}
        icon={<Meh className="h-4 w-4 text-muted-foreground" />}
        description="Neutral sentiment mentions"
      />
    </div>
  );
}
