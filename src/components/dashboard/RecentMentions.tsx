'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Newspaper, FileText, MessagesSquare } from 'lucide-react';
import type { Mention, AnalyzedMention, Sentiment, MentionSource } from '@/lib/types';
import { XIcon } from '@/components/icons';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const sourceIcons: Record<MentionSource, React.ReactNode> = {
  twitter: <XIcon />,
  news: <Newspaper className="h-4 w-4 text-muted-foreground" />,
  blog: <FileText className="h-4 w-4 text-muted-foreground" />,
  forum: <MessagesSquare className="h-4 w-4 text-muted-foreground" />,
};

const sentimentColors: Record<Sentiment, string> = {
  positive: 'bg-green-500',
  negative: 'bg-red-500',
  neutral: 'bg-gray-400',
};

type RecentMentionsProps = {
    initialMentions: Mention[];
    analyzedMentions: AnalyzedMention[];
};

export function RecentMentions({ initialMentions, analyzedMentions }: RecentMentionsProps) {
  const [mentions, setMentions] = useState<Mention[]>(initialMentions);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      const newMention: Mention = {
        id: `new-${Date.now()}`,
        source: 'twitter',
        text: 'Just heard about BrandPulse, looks promising! Will give it a try. #marketing',
        author: 'New User',
        authorHandle: '@newbie',
        avatarUrl: `https://picsum.photos/seed/${Date.now()}/40/40`,
        timestamp: new Date().toISOString(),
        url: '#',
      };
      setMentions((prev) => [newMention, ...prev]);
    }, 15000); // Add a new mention every 15 seconds to simulate real-time

    return () => clearInterval(interval);
  }, []);

  const mentionMap = useMemo(() => {
    return new Map(analyzedMentions.map(m => [m.id, m.sentiment]));
  }, [analyzedMentions]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Mentions</CardTitle>
        <CardDescription>A live feed of your brand mentions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Source</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Mention</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mentions.slice(0, 7).map((mention) => {
              const sentiment = mentionMap.get(mention.id);
              return (
                <TableRow key={mention.id} className="group transition-colors">
                  <TableCell>{sourceIcons[mention.source]}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={mention.avatarUrl}
                        alt={mention.author}
                        width={40}
                        height={40}
                        className="rounded-full"
                        data-ai-hint="person face"
                      />
                      <div>
                        <p className="font-medium">{mention.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {mention.authorHandle}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                        {sentiment ? (
                            <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${sentimentColors[sentiment]}`} title={`Sentiment: ${sentiment}`} />
                        ) : (
                            <Skeleton className="mt-1.5 h-2 w-2 rounded-full shrink-0" />
                        )}
                        <p className="text-sm">{mention.text}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {isClient ? formatDistanceToNow(new Date(mention.timestamp), { addSuffix: true }) : <Skeleton className="h-4 w-20 ml-auto" />}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
