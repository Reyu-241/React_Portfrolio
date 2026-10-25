import { notFound } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";
import { getBlogPost } from "@/lib/blog";

type EditBlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditBlogPostPage({
  params,
}: EditBlogPostPageProps) {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogEditor post={post} />;
}
