import type { Metadata } from "next";
import Link from "next/link";
import { caseStudies } from "@/lib/case-studies";

export const metadata: Metadata = {
  title: "Case Studies | Personal Portfolio",
  description: "Explore case studies for three selected projects.",
};

export default function CaseStudiesPage() {
  return (
    <main className="site-content case-study case-study-index">
      <Link className="text-link" href="/">
        ← Back to home
      </Link>

      <header className="case-study-header">
        <p className="eyebrow">SELECTED WORK / CASE STUDIES</p>
        <h1>
          Projects with a <span className="gradient-text">story.</span>
        </h1>
        <p className="section-intro">
          Take a closer look at the ideas, tools, and thinking behind each
          project.
        </p>
      </header>

      <section className="case-study-grid" aria-label="Project case studies">
        {caseStudies.map((caseStudy) => (
          <Link
            className="glass-card case-study-card"
            href={`/case-study/${caseStudy.slug}`}
            key={caseStudy.slug}
          >
            <div className="case-study-card-topline">
              <span className="eyebrow">CASE STUDY / {caseStudy.number}</span>
              <span className="project-symbol" aria-hidden="true">
                ↗
              </span>
            </div>
            <div
              className={`case-study-card-art case-study-card-art-${caseStudy.number}`}
              aria-hidden="true"
            >
              <span>{caseStudy.number}</span>
            </div>
            <h2>{caseStudy.title}</h2>
            <p>{caseStudy.summary}</p>
            <div className="tag-list case-study-tags">
              {caseStudy.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
            <span className="case-study-card-link">
              Read case study <span aria-hidden="true">↗</span>
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
