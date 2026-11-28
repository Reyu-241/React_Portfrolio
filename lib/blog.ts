import matter from "gray-matter";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@/lib/supabase/server";
import {
  isBlogPostMetadata,
  isValidBlogSlug,
} from "@/lib/blog-validation";
import type { BlogPost, BlogPostMetadata } from "@/types/blog";

const postsDirectory = path.join(process.cwd(), "content", "blog");
export { isBlogPostMetadata, isValidBlogSlug } from "@/lib/blog-validation";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isBlogPostsTableMissing(error: { code?: string }) {
  return error.code === "42P01" || error.code === "PGRST205";
}

function parsePost(slug: string, source: string): BlogPost {
  const parsed = matter(source);
  const metadata = parsed.data as Record<string, unknown>;
  const date = new Date(String(metadata.date ?? ""));

  if (!Number.isFinite(date.getTime())) {
    throw new Error(`Blog post "${slug}" has an invalid date.`);
  }

  for (const field of ["title", "tagline", "preview"] as const) {
    if (typeof metadata[field] !== "string" || !metadata[field].trim()) {
      throw new Error(`Blog post "${slug}" is missing a valid ${field}.`);
    }
  }

  if (metadata.image !== undefined && typeof metadata.image !== "string") {
    throw new Error(`Blog post "${slug}" has an invalid image URL.`);
  }

  return {
    slug,
    date: date.toISOString(),
    title: metadata.title as string,
    tagline: metadata.tagline as string,
    preview: metadata.preview as string,
    image: typeof metadata.image === "string" ? metadata.image : "",
    content: parsed.content,
  };
}

async function getFileBlogPosts(): Promise<BlogPost[]> {
  const entries = await readdir(postsDirectory, { withFileTypes: true });
  const slugs = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        isValidBlogSlug(entry.name.slice(0, -3)),
    )
    .map((entry) => entry.name.slice(0, -3));

  return Promise.all(
    slugs.map(async (slug) => {
      const source = await readFile(
        path.join(postsDirectory, `${slug}.md`),
        "utf8",
      );
      return parsePost(slug, source);
    }),
  );
}

function parseDatabasePost(value: unknown): BlogPost {
  if (!isRecord(value) || typeof value.slug !== "string") {
    throw new Error("Saved blog post has an invalid format.");
  }

  const metadata = {
    date: value.date,
    title: value.title,
    tagline: value.tagline,
    preview: value.preview,
    image: value.image,
  };
  if (!isBlogPostMetadata(metadata) || typeof value.content !== "string") {
    throw new Error("Saved blog post has an invalid format.");
  }

  return {
    slug: value.slug,
    ...metadata,
    content: value.content,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const filePosts = await getFileBlogPosts();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, date, title, tagline, preview, image, content")
    .eq("is_published", true)
    .order("date", { ascending: false });

  if (error && !isBlogPostsTableMissing(error)) {
    throw new Error(`Blog posts could not be loaded: ${error.message}`);
  }

  const posts = error ? [] : (data as unknown[]).map(parseDatabasePost);
  const postsBySlug = new Map(
    filePosts.map((post) => [post.slug, post] as const),
  );
  for (const post of posts) {
    postsBySlug.set(post.slug, post);
  }

  return [...postsBySlug.values()].sort((left, right) =>
    right.date.localeCompare(left.date),
  );
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  if (!isValidBlogSlug(slug)) {
    return undefined;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, date, title, tagline, preview, image, content")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error && !isBlogPostsTableMissing(error)) {
    throw new Error(`Blog post could not be loaded: ${error.message}`);
  }
  if (data) {
    return parseDatabasePost(data);
  }

  try {
    const source = await readFile(path.join(postsDirectory, `${slug}.md`), "utf8");
    return parsePost(slug, source);
  } catch (fileError) {
    if (
      fileError instanceof Error &&
      "code" in fileError &&
      fileError.code === "ENOENT"
    ) {
      return undefined;
    }

    throw fileError;
  }
}

export async function createBlogPost(
  metadata: BlogPostMetadata,
  content: string,
): Promise<string> {
  const slug = randomUUID().replaceAll("-", "");
  await writeBlogPost(slug, metadata, content);
  return slug;
}

export async function writeBlogPost(
  slug: string,
  metadata: BlogPostMetadata,
  content: string,
): Promise<void> {
  if (!isValidBlogSlug(slug)) {
    throw new Error("Invalid blog post slug.");
  }

  await mkdir(postsDirectory, { recursive: true });
  await writeFile(
    path.join(postsDirectory, `${slug}.md`),
    matter.stringify(content, metadata),
    "utf8",
  );
}

export async function removeBlogPost(slug: string): Promise<void> {
  if (!isValidBlogSlug(slug)) {
    throw new Error("Invalid blog post slug.");
  }

  await unlink(path.join(postsDirectory, `${slug}.md`));
}
