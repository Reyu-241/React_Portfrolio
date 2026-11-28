import { caseStudies, isCaseStudyContent, type CaseStudy } from "@/lib/case-studies";
import { createClient } from "@/lib/supabase/server";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isCaseStudiesTableMissing(error: { code?: string }) {
  return error.code === "42P01" || error.code === "PGRST205";
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("case_studies")
    .select("slug, content");

  if (error) {
    if (isCaseStudiesTableMissing(error)) {
      return caseStudies;
    }
    throw new Error(`Case studies could not be loaded: ${error.message}`);
  }

  const savedCaseStudies = (data as unknown[]).map((row) => {
    if (
      !isRecord(row) ||
      typeof row.slug !== "string" ||
      !isCaseStudyContent(row.content)
    ) {
      throw new Error("Saved case-study content has an invalid format.");
    }

    return { ...row.content, slug: row.slug };
  });

  return savedCaseStudies.sort((left, right) =>
    left.number.localeCompare(right.number, undefined, { numeric: true }),
  );
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  const caseStudy = (await getCaseStudies()).find(
    (item) => item.slug === slug,
  );
  return caseStudy;
}
