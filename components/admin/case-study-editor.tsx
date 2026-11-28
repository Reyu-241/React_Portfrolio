"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  isCaseStudyContent,
  type CaseStudy,
  type CaseStudyContent,
} from "@/lib/case-studies";
import { createClient } from "@/lib/supabase/client";

export default function CaseStudyEditor({
  caseStudy: initialCaseStudy,
}: {
  caseStudy: CaseStudy;
}) {
  const router = useRouter();
  const [caseStudy, setCaseStudy] = useState(initialCaseStudy);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  function updateSection(
    index: number,
    field: "heading" | "description",
    value: string,
  ) {
    setCaseStudy((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index
          ? { ...section, [field]: value }
          : section,
      ),
    }));
  }

  function updateScreenshot(
    index: number,
    field: "src" | "alt" | "caption" | "width" | "height",
    value: string,
  ) {
    setCaseStudy((current) => ({
      ...current,
      screenshots: (current.screenshots ?? []).map(
        (screenshot, screenshotIndex) =>
          screenshotIndex === index
            ? {
                ...screenshot,
                [field]:
                  field === "width" || field === "height"
                    ? Number(value)
                    : value,
              }
            : screenshot,
      ),
    }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const { slug, ...content } = caseStudy;
    const updatedContent: CaseStudyContent = {
      ...content,
      title: content.title.trim(),
      summary: content.summary.trim(),
      description: content.description.trim(),
      repository: content.repository.trim(),
      technologies: content.technologies
        .map((technology) => technology.trim())
        .filter(Boolean),
      sections: content.sections.map((section) => ({
        heading: section.heading.trim(),
        description: section.description.trim(),
      })),
      screenshots: content.screenshots?.map((screenshot) => ({
        ...screenshot,
        src: screenshot.src.trim(),
        alt: screenshot.alt.trim(),
        caption: screenshot.caption.trim(),
      })),
    };

    try {
      if (!isCaseStudyContent(updatedContent)) {
        throw new Error("Check the case-study fields and screenshot dimensions.");
      }

      const { data, error } = await createClient()
        .from("case_studies")
        .update({ content: updatedContent })
        .eq("slug", slug)
        .select("slug")
        .maybeSingle();

      if (error) {
        throw new Error(`Case study could not be saved: ${error.message}`);
      }
      if (!data) {
        throw new Error("Case study was not found or you do not have edit access.");
      }

      setCaseStudy({ ...updatedContent, slug });
      setStatus("Case study saved.");
      router.refresh();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Case study could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="glass-card editor-fields admin-content-editor" onSubmit={save}>
      <label>
        Project number
        <input readOnly value={caseStudy.number} />
      </label>
      <label>
        Title
        <input
          maxLength={200}
          required
          value={caseStudy.title}
          onChange={(event) =>
            setCaseStudy({ ...caseStudy, title: event.target.value })
          }
        />
      </label>
      <label>
        Summary
        <textarea
          required
          rows={3}
          value={caseStudy.summary}
          onChange={(event) =>
            setCaseStudy({ ...caseStudy, summary: event.target.value })
          }
        />
      </label>
      <label>
        Introduction
        <textarea
          required
          rows={4}
          value={caseStudy.description}
          onChange={(event) =>
            setCaseStudy({ ...caseStudy, description: event.target.value })
          }
        />
      </label>
      <label>
        Repository URL
        <input
          required
          type="url"
          value={caseStudy.repository}
          onChange={(event) =>
            setCaseStudy({ ...caseStudy, repository: event.target.value })
          }
        />
      </label>
      <label>
        Technologies (one per line)
        <textarea
          rows={4}
          value={caseStudy.technologies.join("\n")}
          onChange={(event) =>
            setCaseStudy({
              ...caseStudy,
              technologies: event.target.value.split(/\r?\n/),
            })
          }
        />
      </label>

      <fieldset className="admin-content-fieldset">
        <legend>Case-study sections</legend>
        {caseStudy.sections.map((section, index) => (
          <div className="admin-content-repeater" key={`${index}-${section.heading}`}>
            <label>
              Section heading
              <input
                required
                value={section.heading}
                onChange={(event) =>
                  updateSection(index, "heading", event.target.value)
                }
              />
            </label>
            <label>
              Section text
              <textarea
                required
                rows={4}
                value={section.description}
                onChange={(event) =>
                  updateSection(index, "description", event.target.value)
                }
              />
            </label>
            <button
              className="button button-secondary"
              disabled={caseStudy.sections.length === 1}
              onClick={() =>
                setCaseStudy({
                  ...caseStudy,
                  sections: caseStudy.sections.filter(
                    (_, sectionIndex) => sectionIndex !== index,
                  ),
                })
              }
              type="button"
            >
              Remove section
            </button>
          </div>
        ))}
        <button
          className="button button-secondary"
          onClick={() =>
            setCaseStudy({
              ...caseStudy,
              sections: [
                ...caseStudy.sections,
                { heading: "", description: "" },
              ],
            })
          }
          type="button"
        >
          Add section
        </button>
      </fieldset>

      <fieldset className="admin-content-fieldset">
        <legend>Screenshots</legend>
        {(caseStudy.screenshots ?? []).map((screenshot, index) => (
          <div className="admin-content-repeater" key={`${index}-${screenshot.src}`}>
            <label>
              Image path
              <input
                required
                value={screenshot.src}
                onChange={(event) =>
                  updateScreenshot(index, "src", event.target.value)
                }
              />
              <span className="admin-field-hint">
                Use a path from the public folder, such as
                /images/projects/example.png.
              </span>
            </label>
            <label>
              Alternative text
              <input
                required
                value={screenshot.alt}
                onChange={(event) =>
                  updateScreenshot(index, "alt", event.target.value)
                }
              />
            </label>
            <label>
              Caption
              <input
                required
                value={screenshot.caption}
                onChange={(event) =>
                  updateScreenshot(index, "caption", event.target.value)
                }
              />
            </label>
            <div className="admin-content-dimensions">
              <label>
                Image width
                <input
                  min={1}
                  required
                  type="number"
                  value={screenshot.width}
                  onChange={(event) =>
                    updateScreenshot(index, "width", event.target.value)
                  }
                />
              </label>
              <label>
                Image height
                <input
                  min={1}
                  required
                  type="number"
                  value={screenshot.height}
                  onChange={(event) =>
                    updateScreenshot(index, "height", event.target.value)
                  }
                />
              </label>
            </div>
            <button
              className="button button-secondary"
              onClick={() =>
                setCaseStudy({
                  ...caseStudy,
                  screenshots: (caseStudy.screenshots ?? []).filter(
                    (_, screenshotIndex) => screenshotIndex !== index,
                  ),
                })
              }
              type="button"
            >
              Remove screenshot
            </button>
          </div>
        ))}
        <button
          className="button button-secondary"
          onClick={() =>
            setCaseStudy({
              ...caseStudy,
              screenshots: [
                ...(caseStudy.screenshots ?? []),
                {
                  src: "",
                  alt: "",
                  caption: "",
                  width: 1200,
                  height: 800,
                },
              ],
            })
          }
          type="button"
        >
          Add screenshot
        </button>
      </fieldset>

      {status && <p role="status">{status}</p>}
      <button
        className="button button-primary admin-save-button"
        disabled={saving}
        type="submit"
      >
        {saving ? "Saving..." : "Save case study"}
      </button>
    </form>
  );
}
