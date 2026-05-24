import { z } from "zod";
import { paginationSchema } from "../shared";

export const answerSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.string().max(10000).optional(),          // cap answer length
  valueArray: z.array(z.string().max(500)).max(50).optional(), // cap array answers
});

export const submitResponseSchema = z.object({
  formId: z.string().uuid(),
  answers: z.array(answerSchema).min(1).max(200),   // cap max answers
  respondentEmail: z.string().email().optional(),
  respondentName: z.string().max(200).optional(),
  completionTimeSeconds: z.number().int().positive().max(86400).optional(), // max 24h
});

export const listResponsesSchema = paginationSchema.extend({
  formId: z.string().uuid(),
  status: z.enum(["in_progress", "completed", "spam"]).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().max(200).optional(),
});

export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
export type ListResponsesInput = z.infer<typeof listResponsesSchema>;
