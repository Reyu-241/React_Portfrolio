"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  isHomepageContentTableMissing,
  type HomepageContent,
} from "@/lib/homepage-content";
import { createClient } from "@/lib/supabase/client";

type TextField = Exclude<keyof HomepageContent, "skills">;

const fields: { name: TextField; label: string; multiline?: boolean }[] = [
  { name: "name", label: "Display name" },
  { name: "availability", label: "Availability label" },
  { name: "headline", label: "Main headline" },
  { name: "headlineHighlight", label: "Highlighted headline text" },
  { name: "introduction", label: "Introduction", multiline: true },
  { name: "location", label: "Location" },
  { name: "focus", label: "Focus" },
  { name: "aboutHeading", label: "About heading" },
  { name: "aboutDescription", label: "About description", multiline: true },
  { name: "contactHeading", label: "Contact heading" },
  { name: "contactDescription", label: "Contact description", multiline: true },
  { name: "contactEmail", label: "Contact email" },
  { name: "githubUrl", label: "GitHub URL" },
  { name: "linkedinUrl", label: "LinkedIn URL" },
];

export default function HomepageEditor({
  content: initialContent,
}: {
  content: HomepageContent;
}) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const updatedContent = {
      ...content,
      skills: content.skills
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      const { error } = await createClient()
        .from("homepage_content")
        .upsert({ id: true, content: updatedContent }, { onConflict: "id" });

      if (error) {
        if (isHomepageContentTableMissing(error)) {
          throw new Error(
            "Homepage content storage is not set up. Apply the homepage_content Supabase migration before saving.",
          );
        }
        throw new Error(`Homepage content could not be saved: ${error.message}`);
      }

      setContent(updatedContent);
      setStatus("Homepage updated successfully.");
      router.refresh();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Homepage content could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="admin-main">
      <div className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="eyebrow">PORTFOLIO CONTENT</p>
            <h1>Edit homepage</h1>
            <p className="admin-muted">
              Update the text, skills, and links displayed on your main page.
            </p>
          </div>
        </div>

        <form className="glass-card editor-fields admin-homepage-form" onSubmit={save}>
          {fields.map(({ name, label, multiline }) => (
            <label key={name}>
              <span>{label}</span>
              {multiline ? (
                <textarea
                  rows={3}
                  value={content[name]}
                  onChange={(event) =>
                    setContent({ ...content, [name]: event.target.value })
                  }
                />
              ) : (
                <input
                  value={content[name]}
                  onChange={(event) =>
                    setContent({ ...content, [name]: event.target.value })
                  }
                />
              )}
            </label>
          ))}
          <label>
            <span>Skills (one per line)</span>
            <textarea
              rows={5}
              value={content.skills.join("\n")}
              onChange={(event) =>
                setContent({
                  ...content,
                  skills: event.target.value.split(/\r?\n/),
                })
              }
            />
          </label>
          {status && <p role="status">{status}</p>}
          <button
            className="button button-primary admin-save-button"
            disabled={saving}
            type="submit"
          >
            {saving ? "Saving..." : "Save homepage"}
          </button>
        </form>
      </div>
    </main>
  );
}
