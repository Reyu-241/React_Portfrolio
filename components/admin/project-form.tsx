"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  project_url: string | null;
  is_published: boolean;
  sort_order: number;
};

export default function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const projectData = {
      title: String(formData.get("title")).trim(),
      slug: String(formData.get("slug")).trim(),
      description: String(formData.get("description")).trim(),
      image_url: String(formData.get("image_url")).trim() || null,
      project_url: String(formData.get("project_url")).trim() || null,
      is_published: formData.get("is_published") === "on",
      sort_order: Number(formData.get("sort_order")),
    };

    try {
      const supabase = createClient();
      const result = project
        ? await supabase
            .from("projects")
            .update(projectData)
            .eq("id", project.id)
            .select("id")
            .single()
        : await supabase.from("projects").insert(projectData).select("id").single();

      if (result.error) {
        setErrorMessage(
          `Project could not be saved: ${result.error.message}. Check that the slug is unique and all fields are valid.`,
        );
        return;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Project could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="editor-fields admin-project-form" onSubmit={handleSubmit}>
      <label>
        Project title
        <input
          autoComplete="off"
          defaultValue={project?.title ?? ""}
          maxLength={200}
          name="title"
          required
        />
      </label>
      <label>
        URL slug
        <input
          autoComplete="off"
          defaultValue={project?.slug ?? ""}
          maxLength={160}
          name="slug"
          pattern="[a-zA-Z0-9-]+"
          required
        />
        <span className="admin-field-hint">
          Used in the project address, for example /projects/my-project.
        </span>
      </label>
      <label>
        Description
        <textarea
          defaultValue={project?.description ?? ""}
          maxLength={10000}
          name="description"
          rows={6}
        />
      </label>
      <label>
        Image URL
        <input
          defaultValue={project?.image_url ?? ""}
          name="image_url"
          type="url"
        />
      </label>
      <label>
        Project link
        <input
          defaultValue={project?.project_url ?? ""}
          name="project_url"
          type="url"
        />
      </label>
      <label>
        Display order
        <input
          defaultValue={project?.sort_order ?? 0}
          name="sort_order"
          type="number"
        />
      </label>
      <label className="admin-checkbox-label">
        <input
          defaultChecked={project?.is_published ?? false}
          name="is_published"
          type="checkbox"
        />
        Publish this project
      </label>

      {errorMessage && (
        <p className="admin-error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        aria-busy={isSaving}
        className="button button-primary admin-save-button"
        disabled={isSaving}
        type="submit"
      >
        {isSaving ? "Saving..." : project ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}
