import { z } from 'zod'

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/) // YYYY-MM-DD

export const generateReportSchema = z.object({
  organizationId: z.string().uuid(),
  startDate: dateSchema,
  endDate: dateSchema
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  { message: 'Start date must be before or equal to end date' }
)

export const getReportQuerySchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema
}).refine(
  (data) => new Date(data.startDate) <= new Date(data.endDate),
  { message: 'Start date must be before or equal to end date' }
)

export type GenerateReportInput = z.infer<typeof generateReportSchema>
export type GetReportQueryInput = z.infer<typeof getReportQuerySchema> 