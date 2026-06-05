'use server';
/**
 * @fileOverview A fusion energy expert AI agent.
 *
 * - askFusionExpert - A function that handles complex fusion physics queries.
 * - FusionExpertInput - The input type for the flow.
 * - FusionExpertOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FusionExpertInputSchema = z.object({
  query: z.string().describe('The user question about fusion physics, reactor design, or energy logistics.'),
});
export type FusionExpertInput = z.infer<typeof FusionExpertInputSchema>;

const FusionExpertOutputSchema = z.object({
  answer: z.string().describe('A detailed, technically accurate response to the fusion query.'),
  confidence: z.number().describe('Confidence level in the technical accuracy (0-1).'),
  relatedConcepts: z.array(z.string()).describe('A list of 2-3 related physics concepts for further reading.'),
});
export type FusionExpertOutput = z.infer<typeof FusionExpertOutputSchema>;

export async function askFusionExpert(input: FusionExpertInput): Promise<FusionExpertOutput> {
  return fusionExpertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fusionExpertPrompt',
  input: { schema: FusionExpertInputSchema },
  output: { schema: FusionExpertOutputSchema },
  prompt: `You are a world-class nuclear physicist specializing in magnetically confined fusion and aneutronic fuel cycles.
  
  Your goal is to provide deep technical insights into reactor design, fuel logistics (like Tritium breeding and Helium-3 harvesting), and plasma stability.
  
  User Question: {{{query}}}
  
  Provide a technically rigorous yet accessible answer. If the question involves Tritium or Helium-3, discuss decay rates, breeding ratios, and logistical constraints.`,
});

const fusionExpertFlow = ai.defineFlow(
  {
    name: 'fusionExpertFlow',
    inputSchema: FusionExpertInputSchema,
    outputSchema: FusionExpertOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('Failed to generate expert response.');
    return output;
  }
);
