import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Personal Portfolio",
  description: "Articles and notes from my development journey.",
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <main className="site-content section">
      <Link className="text-link" href="/">
        ← Back to home
      </Link>
      <div className="section-heading">
        <p className="eyebrow">WRITING</p>
        <h1>
          Notes from my <span className="gradient-text">journey.</span>
        </h1>
        <p className="section-intro">
          Articles and ideas about building for the web.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="project-grid">
          {posts.map((post) => (
            <article className="glass-card project-card" key={post.slug}>
              <p className="eyebrow">
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                }).format(new Date(post.date))}
              </p>
              <h2>{post.title}</h2>
              <p>{post.preview}</p>
              <Link className="project-link" href={`/blog/${post.slug}`}>
                Read article <span>↗</span>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass-card about-card">
          <h2>No articles yet</h2>
          <p>New writing will appear here when it is added to the repository.</p>
        </div>
      )}

      {process.env.NODE_ENV === "development" && (
        <div className="edit-note">
          <p>
            Add Markdown files with frontmatter under{" "}
            <code>content/blog/</code>.
          </p>
          <Link className="button button-secondary" href="/edit/blog/new">
            Create a local draft
          </Link>
          <Link className="button button-secondary" href="/edit">
            Edit portfolio data
          </Link>
        </div>
      )}
    </main>
  );
}
