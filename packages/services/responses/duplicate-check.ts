import { eq, and, gte, sql } from "@repo/database";
import db, { formResponsesTable } from "@repo/database";

/**
 * Simple duplicate submission prevention.
 * Checks if the same IP or email has recently submitted to the same form.
 */
export async function checkDuplicateSubmission(opts: {
  formId: string;
  ipAddress?: string;
  respondentEmail?: string;
  windowMinutes?: number;
}): Promise<{ isDuplicate: boolean; reason?: string }> {
  const windowMs = (opts.windowMinutes ?? 60) * 60 * 1000;
  const since = new Date(Date.now() - windowMs);

  // Check IP-based duplicate (same IP, same form, within window)
  if (opts.ipAddress) {
    const [ipRow] = await db
      .select({ id: formResponsesTable.id })
      .from(formResponsesTable)
      .where(
        and(
          eq(formResponsesTable.formId, opts.formId),
          eq(formResponsesTable.ipAddress, opts.ipAddress),
          gte(formResponsesTable.submittedAt, since),
          eq(formResponsesTable.status, "completed")
        )
      )
      .limit(1);

    if (ipRow) {
      return { isDuplicate: true, reason: "IP_ALREADY_SUBMITTED" };
    }
  }

  // Check email-based duplicate (same email, same form, within window)
  if (opts.respondentEmail) {
    const [emailRow] = await db
      .select({ id: formResponsesTable.id })
      .from(formResponsesTable)
      .where(
        and(
          eq(formResponsesTable.formId, opts.formId),
          eq(formResponsesTable.respondentEmail, opts.respondentEmail),
          gte(formResponsesTable.submittedAt, since),
          eq(formResponsesTable.status, "completed")
        )
      )
      .limit(1);

    if (emailRow) {
      return { isDuplicate: true, reason: "EMAIL_ALREADY_SUBMITTED" };
    }
  }

  return { isDuplicate: false };
}
