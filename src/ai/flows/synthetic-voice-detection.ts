'use server';

/**
 * @fileOverview An AI agent for detecting synthetic voices in real-time.
 *
 * - detectSyntheticVoice - A function that handles the synthetic voice detection process.
 * - DetectSyntheticVoiceInput - The input type for the detectSyntheticVoice function.
 * - DetectSyntheticVoiceOutput - The return type for the detectSyntheticVoice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectSyntheticVoiceInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectSyntheticVoiceInput = z.infer<typeof DetectSyntheticVoiceInputSchema>;

const DetectSyntheticVoiceOutputSchema = z.object({
  isSynthetic: z.boolean().describe('Whether the voice is detected as synthetic or not.'),
  confidence: z.number().describe('The confidence score of the detection (0 to 1).'),
  rationale: z.string().describe('The rationale behind the synthetic voice detection.'),
});
export type DetectSyntheticVoiceOutput = z.infer<typeof DetectSyntheticVoiceOutputSchema>;

export async function detectSyntheticVoice(input: DetectSyntheticVoiceInput): Promise<DetectSyntheticVoiceOutput> {
  return detectSyntheticVoiceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectSyntheticVoicePrompt',
  input: {schema: DetectSyntheticVoiceInputSchema},
  output: {schema: DetectSyntheticVoiceOutputSchema},
  prompt: `You are an AI expert in detecting synthetic voices.

You will analyze the provided audio data and determine if the voice is synthetic or not.  Provide a confidence score between 0 and 1.

Audio: {{media url=audioDataUri}}`,
});

const detectSyntheticVoiceFlow = ai.defineFlow(
  {
    name: 'detectSyntheticVoiceFlow',
    inputSchema: DetectSyntheticVoiceInputSchema,
    outputSchema: DetectSyntheticVoiceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
