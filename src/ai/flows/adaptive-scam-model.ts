'use server';

/**
 * @fileOverview An adaptive scam detection AI agent.
 *
 * - updateScamPatterns - A function that updates the scam patterns.
 * - UpdateScamPatternsInput - The input type for the updateScamPatterns function.
 * - UpdateScamPatternsOutput - The return type for the updateScamPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateScamPatternsInputSchema = z.object({
  region: z.string().describe('The region for which to update scam patterns.'),
  recentScamReports: z
    .array(z.string())
    .describe('A list of recent scam reports from the specified region.'),
});
export type UpdateScamPatternsInput = z.infer<typeof UpdateScamPatternsInputSchema>;

const UpdateScamPatternsOutputSchema = z.object({
  updatedScamPatterns: z
    .array(z.string())
    .describe('A list of updated scam patterns.'),
});
export type UpdateScamPatternsOutput = z.infer<typeof UpdateScamPatternsOutputSchema>;

export async function updateScamPatterns(input: UpdateScamPatternsInput): Promise<UpdateScamPatternsOutput> {
  return updateScamPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updateScamPatternsPrompt',
  input: {schema: UpdateScamPatternsInputSchema},
  output: {schema: UpdateScamPatternsOutputSchema},
  prompt: `You are an expert in identifying scam patterns.

  Given the region: {{{region}}} and recent scam reports:
  {{#each recentScamReports}}
  - {{{this}}}
  {{/each}}

  Identify common phrases, keywords, and language models used in these scams.
  Return an array of updated scam patterns that can be used to detect similar scams in the future.
  Each item in the array should be a single, complete scam pattern. Here's how the response should be formatted:
  \n{ \"updatedScamPatterns\": [\"scam pattern 1\", \"scam pattern 2\", ...] }`,
});

const updateScamPatternsFlow = ai.defineFlow(
  {
    name: 'updateScamPatternsFlow',
    inputSchema: UpdateScamPatternsInputSchema,
    outputSchema: UpdateScamPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
