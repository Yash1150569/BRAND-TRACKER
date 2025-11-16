'use client';

import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { TopicCluster, Mention } from '@/lib/types';
import { getTopicsForMentions } from '@/app/actions';
import { RefreshCw } from 'lucide-react';

type TopicClustersProps = {
  initialTopics: TopicCluster[];
  allMentions: Mention[];
};

export function TopicClusters({ initialTopics, allMentions }: TopicClustersProps) {
  const [topics, setTopics] = useState<TopicCluster[]>(initialTopics);
  const [isLoading, setIsLoading] = useState(initialTopics.length === 0);

  const handleRefresh = async () => {
    setIsLoading(true);
    const newTopics = await getTopicsForMentions(allMentions);
    setTopics(newTopics);
    setIsLoading(false);
  };
  
  useEffect(() => {
    if(initialTopics.length === 0) {
        handleRefresh();
    }
  }, [initialTopics]);


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Topic Clusters</CardTitle>
            <CardDescription>Key discussion themes.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {topics.map((cluster, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  {cluster.topic}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                    {cluster.mentions.map((mention, mentionIndex) => (
                      <li key={mentionIndex}>{mention}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
