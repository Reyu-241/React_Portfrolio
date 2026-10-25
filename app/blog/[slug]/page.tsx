import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Article not found | Personal Portfolio" };
  }

  return {
    title: `${post.title} | Personal Portfolio`,
    description: post.preview,
  };
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="site-content section">
      <Link className="text-link" href="/blog">
        ← All articles
      </Link>
      <article>
        <p className="eyebrow">
          {new Intl.DateTimeFormat("en", {
            dateStyle: "long",
          }).format(new Date(post.date))}
        </p>
        <h1>{post.title}</h1>
        <p className="section-intro">{post.tagline}</p>
        <div className="glass-card about-card markdown-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        {process.env.NODE_ENV === "development" && (
          <Link className="edit-note" href={`/edit/blog/${post.slug}`}>
            Edit this article
          </Link>
        )}
      </article>
    </main>
  );
}
