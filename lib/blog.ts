import matter from "gray-matter";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BlogPost, BlogPostMetadata } from "@/types/blog";

const postsDirectory = path.join(process.cwd(), "content", "blog");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isBlogPostMetadata(
  value: unknown,
): value is BlogPostMetadata {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const metadata = value as Record<string, unknown>;
  return (
    typeof metadata.date === "string" &&
    Number.isFinite(new Date(metadata.date).getTime()) &&
    typeof metadata.title === "string" &&
    metadata.title.trim().length > 0 &&
    typeof metadata.tagline === "string" &&
    typeof metadata.preview === "string" &&
    typeof metadata.image === "string"
  );
}

export function isValidBlogSlug(slug: string): boolean {
  return slugPattern.test(slug);
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

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const entries = await readdir(postsDirectory, { withFileTypes: true });
  const slugs = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".md") &&
        isValidBlogSlug(entry.name.slice(0, -3)),
    )
    .map((entry) => entry.name.slice(0, -3));

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const source = await readFile(
        path.join(postsDirectory, `${slug}.md`),
        "utf8",
      );
      return parsePost(slug, source);
    }),
  );

  return posts.sort((left, right) => right.date.localeCompare(left.date));
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  if (!isValidBlogSlug(slug)) {
    return undefined;
  }

  try {
    const source = await readFile(
      path.join(postsDirectory, `${slug}.md`),
      "utf8",
    );
    return parsePost(slug, source);
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return undefined;
    }

    throw error;
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
