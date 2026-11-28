"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isValidBlogSlug } from "@/lib/blog-validation";
import { createClient } from "@/lib/supabase/client";
import type { BlogPost } from "@/types/blog";

type AdminBlogPost = BlogPost & {
  is_published: boolean;
};

function getInitialDate(date?: string) {
  return date ? new Date(date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
}

function makeSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BlogEditor({
  post,
}: {
  post?: AdminBlogPost;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [date, setDate] = useState(getInitialDate(post?.date));
  const [title, setTitle] = useState(post?.title ?? "");
  const [tagline, setTagline] = useState(post?.tagline ?? "");
  const [preview, setPreview] = useState(post?.preview ?? "");
  const [image, setImage] = useState(post?.image ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [isPublished, setIsPublished] = useState(post?.is_published ?? false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");

    try {
      const postData = {
        slug: slug.trim(),
        date: new Date(date).toISOString(),
        title: title.trim(),
        tagline: tagline.trim(),
        preview: preview.trim(),
        image: image.trim(),
        content,
        is_published: isPublished,
      };

      if (!isValidBlogSlug(postData.slug)) {
        throw new Error(
          "Use a lowercase URL slug with letters, numbers, and hyphens only.",
        );
      }

      const supabase = createClient();
      const result = post
        ? await supabase
            .from("blog_posts")
            .update(postData)
            .eq("slug", post.slug)
            .select("slug")
            .maybeSingle()
        : await supabase
            .from("blog_posts")
            .insert(postData)
            .select("slug")
            .single();

      if (result.error) {
        throw new Error(`Article could not be saved: ${result.error.message}`);
      }
      if (!result.data) {
        throw new Error("Article was not found or you do not have edit access.");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Article could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deletePost() {
    if (!post || !window.confirm("Delete this article permanently?")) {
      return;
    }

    setSaving(true);
    setErrorMessage("");
    try {
      const { data, error } = await createClient()
        .from("blog_posts")
        .delete()
        .eq("slug", post.slug)
        .select("slug")
        .maybeSingle();

      if (error) {
        throw new Error(`Article could not be deleted: ${error.message}`);
      }
      if (!data) {
        throw new Error("Article was not found or you do not have delete access.");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Article could not be deleted.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="glass-card editor-fields admin-content-editor" onSubmit={save}>
      <label>
        Article title
        <input
          maxLength={200}
          required
          value={title}
          onChange={(event) => {
            const nextTitle = event.target.value;
            setTitle(nextTitle);
            if (!post) {
              setSlug(makeSlug(nextTitle));
            }
          }}
        />
      </label>
      <label>
        URL slug
        <input
          autoComplete="off"
          maxLength={160}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          required
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
        />
        <span className="admin-field-hint">
          The article URL will be /blog/{slug || "your-article"}.
        </span>
      </label>
      <label>
        Publication date
        <input
          required
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>
      <label>
        Tagline
        <input
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
        />
      </label>
      <label>
        Preview
        <textarea
          rows={3}
          value={preview}
          onChange={(event) => setPreview(event.target.value)}
        />
      </label>
      <label>
        Image URL (optional)
        <input
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
        />
      </label>
      <label>
        Article content (Markdown)
        <textarea
          required
          rows={18}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>
      <label className="admin-checkbox-label">
        <input
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
          type="checkbox"
        />
        Publish this article
      </label>

      {errorMessage && (
        <p className="admin-error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="admin-content-actions">
        <button
          className="button button-primary admin-save-button"
          disabled={saving}
          type="submit"
        >
          {saving ? "Saving..." : post ? "Save article" : "Create article"}
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
    </form>
  );
}
