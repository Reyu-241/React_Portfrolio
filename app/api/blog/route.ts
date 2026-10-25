import {
  createBlogPost,
  isBlogPostMetadata,
  isValidBlogSlug,
  removeBlogPost,
} from "@/lib/blog";

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
    !isBlogPostMetadata(body.metadata) ||
    typeof body.content !== "string"
  ) {
    return Response.json({ error: "Invalid blog post data." }, { status: 400 });
  }

  try {
    const slug = await createBlogPost(body.metadata, body.content);
    return Response.json({ slug }, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog post.", error);
    return Response.json(
      { error: "Blog post could not be created." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isObject(body) || typeof body.slug !== "string" || !isValidBlogSlug(body.slug)) {
    return Response.json({ error: "Invalid blog post slug." }, { status: 400 });
  }

  try {
    await removeBlogPost(body.slug);
    return Response.json({ deleted: true });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return Response.json({ error: "Blog post not found." }, { status: 404 });
    }

    console.error("Failed to delete blog post.", error);
    return Response.json(
      { error: "Blog post could not be deleted." },
      { status: 500 },
    );
  }
}
