
'use server';

/**
 * @fileOverview Sentiment analysis flow for brand mentions.
 *
 * - analyzeMentionSentiment - Analyzes the sentiment of a given text.
 * - AnalyzeMentionSentimentInput - The input type for the analyzeMentionSentiment function.
 * - AnalyzeMentionSentimentOutput - The return type for the analyzeMentionSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMentionSentimentInputSchema = z.object({
  text: z.string().describe('The text of the brand mention to analyze.'),
});
export type AnalyzeMentionSentimentInput = z.infer<
  typeof AnalyzeMentionSentimentInputSchema
>;

const AnalyzeMentionSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The sentiment of the brand mention.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('The confidence score of the sentiment analysis.'),
});
export type AnalyzeMentionSentimentOutput = z.infer<
  typeof AnalyzeMentionSentimentOutputSchema
>;

export async function analyzeMentionSentiment(
  input: AnalyzeMentionSentimentInput
): Promise<AnalyzeMentionSentimentOutput> {
  return analyzeMentionSentimentFlow(input);
}

const analyzeMentionSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeMentionSentimentFlow',
    inputSchema: AnalyzeMentionSentimentInputSchema,
    outputSchema: AnalyzeMentionSentimentOutputSchema,
  },
  async input => {
    const llmResponse = await ai.generate({
      prompt: `You are an expert sentiment analysis AI. Your task is to analyze the sentiment of the following text and classify it as "positive", "negative", or "neutral". You must also provide a confidence score for your classification, ranging from 0.0 (not confident) to 1.0 (very confident).

Analyze the following text:
"{{{text}}}"

If the sentiment is unclear, classify it as 'neutral' with a lower confidence score.
`,
      model: 'googleai/gemini-pro',
      input: input,
      output: {
        format: 'json',
        schema: AnalyzeMentionSentimentOutputSchema,
      },
    });

    const output = llmResponse.output();
    if (!output) {
      throw new Error('Failed to get sentiment analysis output.');
    }
    return output;
  }
);
