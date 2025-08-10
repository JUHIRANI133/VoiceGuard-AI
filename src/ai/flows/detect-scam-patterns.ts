'use server';

/**
 * @fileOverview A flow that detects scam patterns in real-time during calls.
 *
 * - detectScamPatterns - A function that handles the scam pattern detection process.
 * - DetectScamPatternsInput - The input type for the detectScamPatterns function.
 * - DetectScamPatternsOutput - The return type for the detectScamPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectScamPatternsInputSchema = z.object({
  transcription: z
    .string()
    .describe('The real-time transcription of the call audio.'),
  language: z.string().describe('The language of the call audio.'),
});
export type DetectScamPatternsInput = z.infer<typeof DetectScamPatternsInputSchema>;

const DetectScamPatternsOutputSchema = z.object({
  isScam: z.boolean().describe('Whether the call is likely a scam.'),
  rationale: z
    .string()
    .describe('The rationale for the scam detection, including suspicious phrases.'),
});
export type DetectScamPatternsOutput = z.infer<typeof DetectScamPatternsOutputSchema>;

export async function detectScamPatterns(input: DetectScamPatternsInput): Promise<DetectScamPatternsOutput> {
  return detectScamPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectScamPatternsPrompt',
  input: {schema: DetectScamPatternsInputSchema},
  output: {schema: DetectScamPatternsOutputSchema},
  prompt: `You are an AI agent specializing in detecting scam patterns during phone calls.
  You are provided with a real-time transcription of the call audio and the language of the call.
  Your task is to analyze the transcription and determine if it exhibits patterns indicative of a scam.

  Transcription: {{{transcription}}}
  Language: {{{language}}}

  Identify any suspicious phrases, high-pressure tactics, requests for sensitive information (e.g., passwords, bank details),
  or emotional manipulation techniques (e.g., threats, urgency).

  Based on your analysis, determine whether the call is likely a scam and provide a rationale for your determination.

  Respond in the following JSON format:
  {
    "isScam": true/false,
    "rationale": "Explanation of why the call is a scam or not, including specific examples from the transcription."
  }`,
});

const detectScamPatternsFlow = ai.defineFlow(
  {
    name: 'detectScamPatternsFlow',
    inputSchema: DetectScamPatternsInputSchema,
    outputSchema: DetectScamPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
