import { z } from "zod";
import { router, protectedProcedure } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { analyticsService } from "@repo/services/analytics";
import { analyticsQuerySchema } from "@repo/validators/analytics";

const TAGS = ["Analytics"];
const getPath = generatePath("/analytics");

const dailyDataOutput = z.object({
  date: z.string(),
  views: z.number(),
  submissions: z.number(),
  uniqueVisitors: z.number(),
  conversionRate: z.number(),
  avgCompletionSeconds: z.number().nullable(),
});

export const analyticsRouter = router({
  /** GET /analytics/form — get analytics for a specific form */
  getFormAnalytics: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/form"), tags: TAGS } })
    .input(analyticsQuerySchema)
    .output(z.object({
      formId: z.string(),
      totalViews: z.number(),
      totalSubmissions: z.number(),
      conversionRate: z.number(),
      avgCompletionSeconds: z.number().nullable(),
      dailyData: z.array(dailyDataOutput),
    }))
    .query(async ({ input, ctx }) => {
      return analyticsService.getFormAnalytics(input, ctx.user!.id);
    }),

  /** GET /analytics/dashboard — creator-wide overview */
  dashboard: protectedProcedure
    .meta({ openapi: { method: "GET", path: getPath("/dashboard"), tags: TAGS } })
    .input(z.undefined())
    .output(z.object({
      totalForms: z.number(),
      totalResponses: z.number(),
      totalViews: z.number(),
      avgConversionRate: z.number(),
    }))
    .query(async ({ ctx }) => {
      return analyticsService.getCreatorDashboard(ctx.user!.id);
    }),
});
