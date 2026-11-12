import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/project-form";
import DeleteProjectButton from "@/components/admin/delete-project-button";
import { requirePortfolioOwner } from "@/lib/supabase/server";

type EditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await requirePortfolioOwner();
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, description, image_url, project_url, is_published, sort_order",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Project could not be loaded: ${error.message}`);
  }
  if (!project) {
    notFound();
  }

  return (
    <main className="admin-main">
      <div className="admin-content admin-form-content">
        <Link className="admin-back-link" href="/admin/projects">
          &larr; Back to projects
        </Link>
        <p className="eyebrow">PORTFOLIO CONTENT</p>
        <h1>Edit project</h1>
        <ProjectForm project={project} />
        <section className="admin-danger-zone">
          <h2>Delete project</h2>
          <p className="admin-muted">
            This permanently removes the project from your portfolio.
          </p>
          <DeleteProjectButton id={project.id} />
        </section>
      </div>
    </main>
  );
}
