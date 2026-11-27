import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pokedex Case Study | Personal Portfolio",
  description:
    "A long-form case study for the Pokedex project.",
};

const stack = [
  "HTML",
  "CSS",
  "JavaScript",
  "Git",
  "GitHub",
];

export default function CaseStudyPage() {
  return (
    <main className="site-content case-study">
      <Link className="text-link" href="/">
        ← Back to home
      </Link>

      <header className="case-study-header">
        <p className="eyebrow">CASE STUDY / 01</p>
        <h1>
          Pokedex <span className="gradient-text">experience.</span>
        </h1>
        <p className="section-intro">
          A temporary overview for the Pokedex project. Replace this summary
          with the final project story when your case-study information is ready.
        </p>
      </header>

      <div className="case-study-actions">
        <a
          className="button button-primary"
          href="#"
          target="_blank"
          rel="noreferrer"
        >
          View live project <span>↗</span>
        </a>
        <a
          className="button button-secondary"
          href="https://github.com/Reyu-241/Pokedex"
          target="_blank"
          rel="noreferrer"
        >
          View repository <span>↗</span>
        </a>
      </div>

      <article className="case-study-content">
        <section className="case-study-section">
          <p className="case-study-number">01</p>
          <div>
            <h2>The problem</h2>
            <p>
              Describe the main challenge the project needed to solve. For
              example: help users quickly find Pokemon information in a clear,
              responsive interface while keeping the experience simple and fast.
            </p>
          </div>
        </section>

        <section className="case-study-section">
          <p className="case-study-number">02</p>
          <div>
            <h2>Your role</h2>
            <p>
              Add the scope of your work here. Explain what you personally
              designed or built, such as the interface, responsive layout,
              JavaScript interactions, API integration, testing, or deployment.
            </p>
          </div>
        </section>

        <section className="case-study-section">
          <p className="case-study-number">03</p>
          <div>
            <h2>The stack</h2>
            <div className="tag-list case-study-tags">
              {stack.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
            <p>
              Add a short explanation of why these technologies were chosen and
              how they supported the project.
            </p>
          </div>
        </section>

        <section className="case-study-section case-study-screenshots">
          <p className="case-study-number">04</p>
          <div>
            <h2>Screenshots</h2>
            <p>
              Replace these placeholders with screenshots or mockups of the
              finished project.
            </p>
            <div className="screenshot-grid" aria-label="Project screenshots">
              <div className="screenshot-placeholder">
                <span>SCREENSHOT / 01</span>
                <strong>Homepage preview</strong>
              </div>
              <div className="screenshot-placeholder">
                <span>SCREENSHOT / 02</span>
                <strong>Project feature preview</strong>
              </div>
              <div className="screenshot-placeholder screenshot-wide">
                <span>SCREENSHOT / 03</span>
                <strong>Responsive layout preview</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="case-study-section">
          <p className="case-study-number">05</p>
          <div>
            <h2>Project links</h2>
            <dl className="case-study-links">
              <div>
                <dt>Live link</dt>
                <dd>
                  <a href="#" target="_blank" rel="noreferrer">
                    Add live project URL <span>↗</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt>Repository</dt>
                <dd>
                  <a
                    href="https://github.com/Reyu-241/Pokedex"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/Reyu-241/Pokedex <span>↗</span>
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="case-study-section">
          <p className="case-study-number">06</p>
          <div>
            <h2>What you would do next</h2>
            <p>
              Outline the next improvements you would make. For example:
              improve accessibility, add search and filtering, introduce
              automated tests, optimize performance, or expand the project with
              additional features.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
