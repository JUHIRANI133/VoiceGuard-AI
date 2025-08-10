'use server';

/**
 * @fileOverview Detects emotional manipulation tactics in caller speech, such as creating a sense of urgency or inducing guilt/fear.
 *
 * - analyzeEmotionalManipulation - Analyzes speech for emotional manipulation.
 * - EmotionalManipulationInput - The input type for the analyzeEmotionalManipulation function.
 * - EmotionalManipulationOutput - The return type for the analyzeEmotionalManipulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmotionalManipulationInputSchema = z.object({
  text: z.string().describe('The transcribed text of the caller speech.'),
});
export type EmotionalManipulationInput = z.infer<typeof EmotionalManipulationInputSchema>;

const EmotionalManipulationOutputSchema = z.object({
  urgencyDetected: z.boolean().describe('Whether a sense of urgency is detected.'),
  guiltInductionDetected: z.boolean().describe('Whether guilt induction is detected.'),
  fearInductionDetected: z.boolean().describe('Whether fear induction is detected.'),
  overallSentiment: z.string().describe('The overall sentiment of the speech (positive, negative, neutral).'),
  rationale: z.string().describe('Rationale for the detected emotional manipulation tactics.'),
});
export type EmotionalManipulationOutput = z.infer<typeof EmotionalManipulationOutputSchema>;

export async function analyzeEmotionalManipulation(input: EmotionalManipulationInput): Promise<EmotionalManipulationOutput> {
  return emotionalManipulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emotionalManipulationPrompt',
  input: {schema: EmotionalManipulationInputSchema},
  output: {schema: EmotionalManipulationOutputSchema},
  prompt: `You are an AI expert in detecting emotional manipulation tactics in speech. Analyze the following text for signs of urgency creation, guilt induction, and fear induction.  Also, determine the overall sentiment of the text.

Text: {{{text}}}

Based on your analysis, set the urgencyDetected, guiltInductionDetected, and fearInductionDetected fields to true or false. Provide a rationale for your findings in the rationale field. Determine the overall sentiment as positive, negative, or neutral and put that value in overallSentiment field.

Output in JSON format.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const emotionalManipulationFlow = ai.defineFlow(
  {
    name: 'emotionalManipulationFlow',
    inputSchema: EmotionalManipulationInputSchema,
    outputSchema: EmotionalManipulationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
