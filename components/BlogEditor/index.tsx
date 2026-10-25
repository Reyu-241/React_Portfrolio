"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BlogPost, BlogPostMetadata } from "@/types/blog";

type BlogEditorProps = {
  post?: BlogPost;
};

function getInitialDate(date?: string): string {
  return date
    ? new Date(date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
}

function getErrorMessage(body: unknown): string {
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }

  return "The post could not be saved.";
}

export default function BlogEditor({ post }: BlogEditorProps) {
  const router = useRouter();
  const [metadata, setMetadata] = useState<BlogPostMetadata>({
    date: getInitialDate(post?.date),
    title: post?.title ?? "",
    tagline: post?.tagline ?? "",
    preview: post?.preview ?? "",
    image: post?.image ?? "",
  });
  const [content, setContent] = useState(post?.content ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateMetadata = (field: keyof BlogPostMetadata, value: string) => {
    setMetadata((current) => ({ ...current, [field]: value }));
  };

  const savePost = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(post ? "/api/blog/edit" : "/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(post ? { slug: post.slug } : {}),
          metadata: {
            ...metadata,
            date: new Date(metadata.date).toISOString(),
          },
          content,
        }),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(result));
      }

      if (!post) {
        if (
          typeof result !== "object" ||
          result === null ||
          !("slug" in result) ||
          typeof result.slug !== "string"
        ) {
          throw new Error("The server did not return the new post URL.");
        }

        router.push(`/edit/blog/${result.slug}`);
        return;
      }

      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The post could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!post || !window.confirm("Delete this article?")) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug }),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(result));
      }

      router.push("/blog");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "The post could not be deleted.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="site-content section">
      <div className="section-heading">
        <p className="eyebrow">LOCAL DEVELOPMENT EDITOR</p>
        <h1>{post ? "Edit article" : "New article"}</h1>
        <p className="section-intro">
          Changes are saved to the repository only in development. Production
          editing is disabled.
        </p>
      </div>

      <div className="glass-card about-card editor-fields">
        <label>
          Title
          <input
            required
            value={metadata.title}
            onChange={(event) => updateMetadata("title", event.target.value)}
          />
        </label>
        <label>
          Date
          <input
            required
            type="date"
            value={getInitialDate(metadata.date)}
            onChange={(event) => updateMetadata("date", event.target.value)}
          />
        </label>
        <label>
          Tagline
          <input
            value={metadata.tagline}
            onChange={(event) => updateMetadata("tagline", event.target.value)}
          />
        </label>
        <label>
          Preview
          <textarea
            value={metadata.preview}
            onChange={(event) => updateMetadata("preview", event.target.value)}
            rows={3}
          />
        </label>
        <label>
          Image URL (optional)
          <input
            type="url"
            value={metadata.image}
            onChange={(event) => updateMetadata("image", event.target.value)}
          />
        </label>
        <label>
          Markdown content
          <textarea
            required
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={18}
          />
        </label>

        {error && <p role="alert">{error}</p>}
        <button
          className="button button-primary"
          disabled={
            saving ||
            !metadata.title.trim() ||
            !Number.isFinite(new Date(metadata.date).getTime())
          }
          onClick={savePost}
          type="button"
        >
          {saving ? "Saving…" : "Save article"}
        </button>
        {post && (
          <button
            className="button button-secondary"
            disabled={saving}
            onClick={deletePost}
            type="button"
          >
            Delete article
          </button>
        )}
      </div>
    </main>
  );
}
