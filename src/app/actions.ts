'use server';

import { analyzeMentionSentiment } from '@/ai/flows/analyze-mention-sentiment';
import { clusterMentions } from '@/ai/flows/cluster-mentions-by-topic';
import { generateBrandReport as generateBrandReportFlow } from '@/ai/flows/generate-brand-report';
import type { Mention, AnalyzedMention, TopicCluster } from '@/lib/types';

export async function getSentimentForMentions(
  mentions: Mention[]
): Promise<AnalyzedMention[]> {
  const analysisPromises = mentions.map(async (mention) => {
    try {
      const sentimentResult = await analyzeMentionSentiment({ text: mention.text });
      return { ...mention, ...sentimentResult };
    } catch (error) {
      console.error(`Failed to analyze sentiment for mention ${mention.id}:`, error);
      // Return the original mention with a neutral sentiment as a fallback
      return { ...mention, sentiment: 'neutral', confidence: 0.5 };
    }
  });

  return Promise.all(analysisPromises);
}

export async function getTopicsForMentions(
  mentions: Mention[]
): Promise<TopicCluster[]> {
  const mentionTexts = mentions.map((m) => m.text);
  try {
    const topics = await clusterMentions(mentionTexts);
    return topics;
  } catch (error) {
    console.error('Failed to cluster topics:', error);
    return [];
  }
}

export async function generateBrandReport(
  timePeriod: string
): Promise<{ report: string }> {
  try {
    const result = await generateBrandReportFlow({ timePeriod, brandName: 'BrandPulse' });
    return result;
  } catch (error) {
    console.error('Failed to generate brand report:', error);
    return { report: 'Error generating report. Please try again.' };
  }
}
