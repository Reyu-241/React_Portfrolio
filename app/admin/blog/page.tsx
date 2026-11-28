import Link from "next/link";
import { isBlogPostsTableMissing } from "@/lib/blog";
import { requirePortfolioOwner } from "@/lib/supabase/server";

export default async function AdminBlogPage() {
  const supabase = await requirePortfolioOwner();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("slug, date, title, preview, is_published, updated_at")
    .order("date", { ascending: false });

  const needsMigration = error && isBlogPostsTableMissing(error);

  return (
    <main className="admin-main">
      <div className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="eyebrow">PORTFOLIO CONTENT</p>
            <h1>Blog</h1>
            <p className="admin-muted">
              Write, publish, and update articles shown on your blog.
            </p>
          </div>
          {!needsMigration && (
            <Link className="button button-primary" href="/admin/blog/new">
              Write article
            </Link>
          )}
        </div>

        {error ? (
          <p className="admin-error" role="alert">
            {needsMigration
              ? "Blog editing is not set up yet. Apply the 20261128150000_admin_content_editing.sql migration in Supabase."
              : `Blog posts could not be loaded: ${error.message}`}
          </p>
        ) : posts.length === 0 ? (
          <section className="admin-empty glass-card">
            <h2>No articles yet</h2>
            <p className="admin-muted">
              Create a draft, then publish it when it is ready.
            </p>
            <Link className="button button-primary" href="/admin/blog/new">
              Write your first article
            </Link>
          </section>
        ) : (
          <div className="admin-project-list">
            {posts.map((post) => (
              <article className="admin-project-card glass-card" key={post.slug}>
                <div className="admin-project-copy">
                  <div className="admin-project-meta">
                    <span
                      className={
                        post.is_published
                          ? "admin-status admin-status-published"
                          : "admin-status"
                      }
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                    <span>
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                      }).format(new Date(post.date))}
                    </span>
                  </div>
                  <h2>{post.title}</h2>
                  <p className="admin-muted">
                    {post.preview || "No preview"}
                  </p>
                  <code className="admin-slug">/{post.slug}</code>
                </div>
                <Link
                  className="button button-secondary"
                  href={`/admin/blog/${post.slug}/edit`}
                >
                  Edit article
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
