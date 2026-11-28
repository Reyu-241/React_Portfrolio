import Link from "next/link";
import { isCaseStudyContent } from "@/lib/case-studies";
import { isCaseStudiesTableMissing } from "@/lib/case-studies-server";
import { requirePortfolioOwner } from "@/lib/supabase/server";

export default async function AdminCaseStudiesPage() {
  const supabase = await requirePortfolioOwner();
  const { data, error } = await supabase
    .from("case_studies")
    .select("slug, content")
    .order("slug", { ascending: true });

  const caseStudies = error
    ? []
    : data
        .map((row) => {
          if (!isCaseStudyContent(row.content)) {
            throw new Error("Saved case-study content has an invalid format.");
          }
          return { ...row.content, slug: row.slug };
        })
        .sort((left, right) =>
          left.number.localeCompare(right.number, undefined, {
            numeric: true,
          }),
        );

  return (
    <main className="admin-main">
      <div className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="eyebrow">PORTFOLIO CONTENT</p>
            <h1>Case studies</h1>
            <p className="admin-muted">
              Edit the content, sections, technologies, and screenshots shown
              on each case study.
            </p>
          </div>
        </div>

        {error ? (
          <p className="admin-error" role="alert">
            {isCaseStudiesTableMissing(error)
              ? "Case-study editing is not set up yet. Apply the 20261128150000_admin_content_editing.sql migration in Supabase."
              : `Case studies could not be loaded: ${error.message}`}
          </p>
        ) : caseStudies.length === 0 ? (
          <section className="admin-empty glass-card">
            <h2>No case studies found</h2>
            <p className="admin-muted">
              Apply the admin content migration to add the portfolio&apos;s
              case studies.
            </p>
          </section>
        ) : (
          <div className="admin-project-list">
            {caseStudies.map((caseStudy) => (
              <article
                className="admin-project-card glass-card"
                key={caseStudy.slug}
              >
                <div className="admin-project-copy">
                  <div className="admin-project-meta">
                    <span>CASE STUDY / {caseStudy.number}</span>
                  </div>
                  <h2>{caseStudy.title}</h2>
                  <p className="admin-muted">{caseStudy.summary}</p>
                </div>
                <Link
                  className="button button-secondary"
                  href={`/admin/case-studies/${caseStudy.slug}/edit`}
                >
                  Edit case study
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
