import { isBlogPostMetadata, isValidBlogSlug, writeBlogPost } from "@/lib/blog";

export const runtime = "nodejs";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (
    !isObject(body) ||
    typeof body.slug !== "string" ||
    !isValidBlogSlug(body.slug) ||
    !isBlogPostMetadata(body.metadata) ||
    typeof body.content !== "string"
  ) {
    return Response.json({ error: "Invalid blog post data." }, { status: 400 });
  }

  try {
    await writeBlogPost(body.slug, body.metadata, body.content);
    return Response.json({ saved: true });
  } catch (error) {
    console.error("Failed to save blog post.", error);
    return Response.json(
      { error: "Blog post could not be saved." },
      { status: 500 },
    );
  }
}
