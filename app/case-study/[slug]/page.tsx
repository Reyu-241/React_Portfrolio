import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies } from "@/lib/case-studies";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies.find((item) => item.slug === slug);

  return {
    title: caseStudy
      ? `${caseStudy.title} Case Study | Personal Portfolio`
      : "Case Study | Personal Portfolio",
    description: caseStudy?.summary,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: CaseStudyPageProps) {
  const { slug } = await params;
  const caseStudy = caseStudies.find((item) => item.slug === slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="site-content case-study">
      <Link className="text-link" href="/case-study">
        ← All case studies
      </Link>

      <header className="case-study-header">
        <p className="eyebrow">CASE STUDY / {caseStudy.number}</p>
        <h1>
          {caseStudy.title} <span className="gradient-text">project.</span>
        </h1>
        <p className="section-intro">{caseStudy.description}</p>
      </header>

      <div className="case-study-actions">
        <a
          className="button button-primary"
          href={caseStudy.repository}
          target="_blank"
          rel="noreferrer"
        >
          View repository <span>↗</span>
        </a>
      </div>

      <article className="case-study-content">
        {caseStudy.sections.map((section, index) => (
          <section className="case-study-section" key={section.heading}>
            <p className="case-study-number">
              {String(index + 1).padStart(2, "0")}
            </p>
            <div>
              <h2>{section.heading}</h2>
              <p>{section.description}</p>
              {index === 0 && (
                <div className="tag-list case-study-tags">
                  {caseStudy.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </article>

      {caseStudy.screenshots && (
        <section className="case-study-gallery" aria-label="Project screenshots">
          <h2>Screenshots</h2>
          <div className="case-study-gallery-grid">
            {caseStudy.screenshots.map((screenshot) => (
              <figure className="case-study-screenshot" key={screenshot.src}>
                <Image
                  alt={screenshot.alt}
                  height={screenshot.height}
                  src={screenshot.src}
                  width={screenshot.width}
                />
                <figcaption>{screenshot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
