import { notFound } from "next/navigation";
import BlogEditor from "@/components/admin/blog-editor";
import { requirePortfolioOwner } from "@/lib/supabase/server";

type EditAdminBlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditAdminBlogPostPage({
  params,
}: EditAdminBlogPostPageProps) {
  const { slug } = await params;
  const supabase = await requirePortfolioOwner();
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("slug, date, title, tagline, preview, image, content, is_published")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`Blog post could not be loaded: ${error.message}`);
  }
  if (!post) {
    notFound();
  }

  return (
    <main className="admin-main">
      <div className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="eyebrow">PORTFOLIO CONTENT / BLOG</p>
            <h1>Edit article</h1>
          </div>
        </div>
        <BlogEditor post={post} />
      </div>
    </main>
  );
}
