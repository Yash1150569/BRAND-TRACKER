'use server';
/**
 * @fileOverview Clusters brand mentions by topic or theme.
 *
 * - clusterMentions - A function that clusters brand mentions by topic or theme.
 * - ClusterMentionsInput - The input type for the clusterMentions function.
 * - ClusterMentionsOutput - The return type for the clusterMentions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClusterMentionsInputSchema = z.array(
  z.string().describe('A brand mention text.')
);
export type ClusterMentionsInput = z.infer<typeof ClusterMentionsInputSchema>;

const ClusterMentionsOutputSchema = z.array(
  z.object({
    topic: z.string().describe('The topic or theme of the mentions.'),
    mentions: z.array(z.string()).describe('The brand mentions associated with the topic.'),
  })
);
export type ClusterMentionsOutput = z.infer<typeof ClusterMentionsOutputSchema>;

export async function clusterMentions(input: ClusterMentionsInput): Promise<ClusterMentionsOutput> {
  return clusterMentionsFlow(input);
}

const clusterMentionsFlow = ai.defineFlow(
  {
    name: 'clusterMentionsFlow',
    inputSchema: ClusterMentionsInputSchema,
    outputSchema: ClusterMentionsOutputSchema,
  },
  async input => {
    const llmResponse = await ai.generate({
      prompt: `You are an expert marketing analyst.

  Your job is to cluster the following brand mentions into topics or themes to identify the key discussion areas related to the brand.
  Return a JSON array of objects, where each object has a "topic" and a "mentions" field. The "topic" field should be a string describing the topic or theme of the mentions. The "mentions" field should be an array of the brand mentions associated with the topic.

  Brand Mentions:
  {{#each this}}
  - {{{this}}}
  {{/each}}
  `,
      model: 'googleai/gemini-pro',
      input: input,
      output: {
        format: 'json',
        schema: ClusterMentionsOutputSchema,
      },
    });
    
    const output = llmResponse.output();
    if (!output) {
      throw new Error('Failed to get topic clusters output.');
    }
    return output;
  }
);
