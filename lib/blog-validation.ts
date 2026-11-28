import type { BlogPostMetadata } from "@/types/blog";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isBlogPostMetadata(
  value: unknown,
): value is BlogPostMetadata {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
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
