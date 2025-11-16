'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating brand reports.
 *
 * - generateBrandReport - A function that generates a brand report based on specified time period.
 * - GenerateBrandReportInput - The input type for the generateBrandReport function.
 * - GenerateBrandReportOutput - The return type for the generateBrandReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBrandReportInputSchema = z.object({
  timePeriod: z
    .string()
    .describe(
      'The time period for the report, e.g., last week, last month, or a specific date range.'
    ),
  brandName: z.string().describe('The name of the brand to analyze.'),
});
export type GenerateBrandReportInput = z.infer<typeof GenerateBrandReportInputSchema>;

const GenerateBrandReportOutputSchema = z.object({
  report: z.string().describe('A summary report of brand mentions, sentiment, and topics.'),
});
export type GenerateBrandReportOutput = z.infer<typeof GenerateBrandReportOutputSchema>;

export async function generateBrandReport(input: GenerateBrandReportInput): Promise<GenerateBrandReportOutput> {
  return generateBrandReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBrandReportPrompt',
  input: {schema: GenerateBrandReportInputSchema},
  output: {schema: GenerateBrandReportOutputSchema},
  prompt: `You are a marketing analyst. Generate a report summarizing brand mentions, sentiment, and topics for the brand '{{brandName}}' over the time period '{{timePeriod}}'. The report should include key discussion areas and sentiment trends.
`,
});

const generateBrandReportFlow = ai.defineFlow(
  {
    name: 'generateBrandReportFlow',
    inputSchema: GenerateBrandReportInputSchema,
    outputSchema: GenerateBrandReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
