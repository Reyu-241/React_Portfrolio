"use client";

import { useState } from "react";
import portfolio from "@/data/portfolio.json";

function getErrorMessage(body: unknown): string {
  if (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
  ) {
    return body.error;
  }

  return "Portfolio data could not be saved.";
}

export default function PortfolioEditor() {
  const [value, setValue] = useState(() => JSON.stringify(portfolio, null, 2));
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const savePortfolio = async () => {
    setSaving(true);
    setStatus("");

    try {
      const data: unknown = JSON.parse(value);
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(result));
      }

      setStatus("Saved. Refresh the page to see the updated repository data.");
    } catch (saveError) {
      setStatus(
        saveError instanceof Error
          ? saveError.message
          : "Portfolio data could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="site-content section">
      <div className="section-heading">
        <p className="eyebrow">LOCAL DEVELOPMENT EDITOR</p>
        <h1>Portfolio data</h1>
        <p className="section-intro">
          Edit the repository data as JSON. This tool is unavailable in
          production because deployed files are read-only.
        </p>
      </div>
      <div className="glass-card about-card editor-fields">
        <label>
          <span>data/portfolio.json</span>
          <textarea
            aria-label="Portfolio JSON"
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={32}
          />
        </label>
        {status && <p role="status">{status}</p>}
        <button
          className="button button-primary"
          disabled={saving}
          onClick={savePortfolio}
          type="button"
        >
          {saving ? "Saving…" : "Save portfolio"}
        </button>
      </div>
    </main>
  );
}
