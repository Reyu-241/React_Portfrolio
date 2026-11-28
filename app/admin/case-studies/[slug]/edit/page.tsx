import { notFound } from "next/navigation";
import CaseStudyEditor from "@/components/admin/case-study-editor";
import { isCaseStudyContent } from "@/lib/case-studies";
import { requirePortfolioOwner } from "@/lib/supabase/server";

type EditCaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditCaseStudyPage({
  params,
}: EditCaseStudyPageProps) {
  const { slug } = await params;
  const supabase = await requirePortfolioOwner();
  const { data, error } = await supabase
    .from("case_studies")
    .select("slug, content")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Case study could not be loaded: ${error.message}`);
  }
  if (!data || !isCaseStudyContent(data.content)) {
    notFound();
  }

  return (
    <main className="admin-main">
      <div className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="eyebrow">PORTFOLIO CONTENT / CASE STUDIES</p>
            <h1>Edit {data.content.title}</h1>
            <p className="admin-muted">
              Update the case study displayed at /case-study/{data.slug}.
            </p>
          </div>
        </div>
        <CaseStudyEditor caseStudy={{ ...data.content, slug: data.slug }} />
      </div>
    </main>
  );
}
