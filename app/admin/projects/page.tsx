import Link from "next/link";
import { requirePortfolioOwner } from "@/lib/supabase/server";

export default async function AdminProjectsPage() {
  const supabase = await requirePortfolioOwner();
  const { data: projects, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, description, is_published, sort_order, updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  return (
    <main className="admin-main">
      <div className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="eyebrow">PORTFOLIO CONTENT</p>
            <h1>Projects</h1>
            <p className="admin-muted">
              Create and manage the projects shown on your portfolio.
            </p>
          </div>
          <Link className="button button-primary" href="/admin/projects/new">
            Add project
          </Link>
        </div>

        {error ? (
          <p className="admin-error" role="alert">
            Projects could not be loaded: {error.message}
          </p>
        ) : projects.length === 0 ? (
          <section className="admin-empty glass-card">
            <h2>No projects yet</h2>
            <p className="admin-muted">
              Add your first project to start building your portfolio.
            </p>
            <Link className="button button-primary" href="/admin/projects/new">
              Create your first project
            </Link>
          </section>
        ) : (
          <div className="admin-project-list">
            {projects.map((project) => (
              <article className="admin-project-card glass-card" key={project.id}>
                <div className="admin-project-copy">
                  <div className="admin-project-meta">
                    <span
                      className={
                        project.is_published
                          ? "admin-status admin-status-published"
                          : "admin-status"
                      }
                    >
                      {project.is_published ? "Published" : "Draft"}
                    </span>
                    <span>Order {project.sort_order}</span>
                  </div>
                  <h2>{project.title}</h2>
                  <p className="admin-muted">
                    {project.description || "No description"}
                  </p>
                  <code className="admin-slug">/{project.slug}</code>
                </div>
                <Link
                  className="button button-secondary"
                  href={`/admin/projects/${project.id}/edit`}
                >
                  Edit
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
