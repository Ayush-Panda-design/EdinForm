import { eq, and, gte, lte, sql } from "@repo/database";
import db, {
  formsTable,
  formViewsTable,
  formResponsesTable,
  analyticsTable,
} from "@repo/database";
import type { AnalyticsQueryInput } from "@repo/validators/analytics";
import type {
  FormAnalyticsSummary,
  DailyAnalytics,
} from "@repo/types/analytics";

export class AnalyticsService {
  /**
   * Get analytics summary for a form
   */
  async getFormAnalytics(
    input: AnalyticsQueryInput,
    creatorId: string
  ): Promise<FormAnalyticsSummary> {
    // Verify ownership
    const [form] = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(
        and(
          eq(formsTable.id, input.formId),
          eq(formsTable.creatorId, creatorId)
        )
      )
      .limit(1);

    if (!form) throw new Error("FORM_NOT_FOUND_OR_UNAUTHORIZED");

    const fromDate = input.from
      ? new Date(input.from)
      : this.defaultFromDate();

    const toDate = input.to ? new Date(input.to) : new Date();

    // Total views in range
    const [viewsResult] = await db
      .select({
        total: sql<number>`count(*)::int`,
      })
      .from(formViewsTable)
      .where(
        and(
          eq(formViewsTable.formId, input.formId),
          gte(formViewsTable.viewedAt, fromDate),
          lte(formViewsTable.viewedAt, toDate)
        )
      );

    // Total submissions in range
    const [subResult] = await db
      .select({
        total: sql<number>`count(*)::int`,
      })
      .from(formResponsesTable)
      .where(
        and(
          eq(formResponsesTable.formId, input.formId),
          gte(formResponsesTable.submittedAt, fromDate),
          lte(formResponsesTable.submittedAt, toDate)
        )
      );

    // Avg completion time
    const [avgResult] = await db
      .select({
        avg: sql<number>`avg(${formResponsesTable.completionTimeSeconds})::int`,
      })
      .from(formResponsesTable)
      .where(
        and(
          eq(formResponsesTable.formId, input.formId),
          gte(formResponsesTable.submittedAt, fromDate),
          lte(formResponsesTable.submittedAt, toDate)
        )
      );

    const totalViews = viewsResult?.total ?? 0;
    const totalSubmissions = subResult?.total ?? 0;

    const conversionRate =
      totalViews > 0
        ? Math.round((totalSubmissions / totalViews) * 1000) / 10
        : 0;

    // Daily aggregates
    const dailyData = await this.getDailyBreakdown(
      input.formId,
      fromDate,
      toDate,
      input.groupBy
    );

    return {
      formId: input.formId,
      totalViews,
      totalSubmissions,
      conversionRate,
      avgCompletionSeconds: avgResult?.avg ?? null,
      dailyData,
    };
  }

  /**
   * Get daily view/submission breakdown
   */
  private async getDailyBreakdown(
    formId: string,
    from: Date,
    to: Date,
    groupBy: "day" | "week" | "month"
  ): Promise<DailyAnalytics[]> {
    const truncUnit =
      groupBy === "day"
        ? "day"
        : groupBy === "week"
        ? "week"
        : "month";

    // Views per period
    const viewRows = await db
      .select({
        period: sql<string>`
          date_trunc(
            ${sql.raw("'" + truncUnit + "'")},
            ${formViewsTable.viewedAt}
          )::date
        `,
        count: sql<number>`count(*)::int`,
        uniqueIps: sql<number>`
          count(distinct ${formViewsTable.ipAddress})::int
        `,
      })
      .from(formViewsTable)
      .where(
        and(
          eq(formViewsTable.formId, formId),
          gte(formViewsTable.viewedAt, from),
          lte(formViewsTable.viewedAt, to)
        )
      )
      .groupBy(
        sql`
          date_trunc(
            ${sql.raw("'" + truncUnit + "'")},
            ${formViewsTable.viewedAt}
          )::date
        `
      )
      .orderBy(
        sql`
          date_trunc(
            ${sql.raw("'" + truncUnit + "'")},
            ${formViewsTable.viewedAt}
          )::date
        `
      );

    // Submissions per period
    const subRows = await db
      .select({
        period: sql<string>`
          date_trunc(
            ${sql.raw("'" + truncUnit + "'")},
            ${formResponsesTable.submittedAt}
          )::date
        `,
        count: sql<number>`count(*)::int`,
        avgCompletion: sql<number>`
          avg(${formResponsesTable.completionTimeSeconds})::int
        `,
      })
      .from(formResponsesTable)
      .where(
        and(
          eq(formResponsesTable.formId, formId),
          gte(formResponsesTable.submittedAt, from),
          lte(formResponsesTable.submittedAt, to)
        )
      )
      .groupBy(
        sql`
          date_trunc(
            ${sql.raw("'" + truncUnit + "'")},
            ${formResponsesTable.submittedAt}
          )::date
        `
      )
      .orderBy(
        sql`
          date_trunc(
            ${sql.raw("'" + truncUnit + "'")},
            ${formResponsesTable.submittedAt}
          )::date
        `
      );

    // Merge by date
    const periodMap = new Map<
      string,
      {
        views: number;
        submissions: number;
        uniqueVisitors: number;
        avgCompletion: number | null;
      }
    >();

    for (const row of viewRows) {
      periodMap.set(row.period, {
        views: row.count,
        submissions: 0,
        uniqueVisitors: row.uniqueIps ?? 0,
        avgCompletion: null,
      });
    }

    for (const row of subRows) {
      const existing = periodMap.get(row.period) ?? {
        views: 0,
        submissions: 0,
        uniqueVisitors: 0,
        avgCompletion: null,
      };

      periodMap.set(row.period, {
        ...existing,
        submissions: row.count,
        avgCompletion: row.avgCompletion ?? null,
      });
    }

    return Array.from(periodMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        views: data.views,
        submissions: data.submissions,
        uniqueVisitors: data.uniqueVisitors,
        conversionRate:
          data.views > 0
            ? Math.round((data.submissions / data.views) * 1000) / 10
            : 0,
        avgCompletionSeconds: data.avgCompletion,
      }));
  }

  /**
   * Upsert daily analytics aggregate
   */
  async upsertDailyAnalytics(formId: string): Promise<void> {
    const today = new Date().toISOString().split("T")[0]!;

    const [viewCount] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(formViewsTable)
      .where(
        and(
          eq(formViewsTable.formId, formId),
          sql`${formViewsTable.viewedAt}::date = ${today}`
        )
      );

    const [subCount] = await db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(formResponsesTable)
      .where(
        and(
          eq(formResponsesTable.formId, formId),
          sql`${formResponsesTable.submittedAt}::date = ${today}`
        )
      );

    const views = viewCount?.count ?? 0;
    const submissions = subCount?.count ?? 0;

    const conversionRate =
      views > 0
        ? `${((submissions / views) * 100).toFixed(1)}%`
        : "0%";

    await db
      .insert(analyticsTable)
      .values({
        formId,
        date: today,
        views,
        submissions,
        conversionRate,
        uniqueVisitors: views,
      })
      .onConflictDoUpdate({
        target: [analyticsTable.formId, analyticsTable.date],
        set: {
          views,
          submissions,
          conversionRate,
          updatedAt: new Date(),
        },
      });
  }

  /**
   * Dashboard overview for a creator
   */
  async getCreatorDashboard(creatorId: string): Promise<{
    totalForms: number;
    totalResponses: number;
    totalViews: number;
    avgConversionRate: number;
  }> {
    const forms = await db
      .select({
        id: formsTable.id,
      })
      .from(formsTable)
      .where(
        and(
          eq(formsTable.creatorId, creatorId),
          eq(formsTable.isArchived, false)
        )
      );

    if (forms.length === 0) {
      return {
        totalForms: 0,
        totalResponses: 0,
        totalViews: 0,
        avgConversionRate: 0,
      };
    }

    const formIds = forms.map((f) => f.id);
    const idsLiteral = `ARRAY['${formIds.join("','")}']::uuid[]`;

    const [respResult] = await db
      .select({
        total: sql<number>`count(*)::int`,
      })
      .from(formResponsesTable)
      .where(
        sql`${formResponsesTable.formId} = ANY(${sql.raw(idsLiteral)})`
      );

    const [viewResult] = await db
      .select({
        total: sql<number>`count(*)::int`,
      })
      .from(formViewsTable)
      .where(
        sql`${formViewsTable.formId} = ANY(${sql.raw(idsLiteral)})`
      );

    const totalViews = viewResult?.total ?? 0;
    const totalResponses = respResult?.total ?? 0;

    const avgConversionRate =
      totalViews > 0
        ? Math.round((totalResponses / totalViews) * 1000) / 10
        : 0;

    return {
      totalForms: forms.length,
      totalResponses,
      totalViews,
      avgConversionRate,
    };
  }

  private defaultFromDate(): Date {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  }
}

export const analyticsService = new AnalyticsService();