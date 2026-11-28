import BlogEditor from "@/components/admin/blog-editor";

export default function NewAdminBlogPostPage() {
  return (
    <main className="admin-main">
      <div className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="eyebrow">PORTFOLIO CONTENT / BLOG</p>
            <h1>Write an article</h1>
            <p className="admin-muted">
              Save it as a draft or publish it to the public blog.
            </p>
          </div>
        </div>
        <BlogEditor />
      </div>
    </main>
  );
}
