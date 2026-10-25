import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import portfolio from "@/data/portfolio.json";

export const metadata: Metadata = {
  title: "Resume | Personal Portfolio",
  description: "Experience, education, and skills.",
};

export default function ResumePage() {
  if (!portfolio.showResume) {
    redirect("/");
  }

  if (!portfolio.resume) {
    notFound();
  }

  const { resume } = portfolio;

  return (
    <main className="site-content section">
      <Link className="text-link" href="/">
        ← Back to home
      </Link>
      <div className="section-heading">
        <p className="eyebrow">EXPERIENCE & EDUCATION</p>
        <h1>{portfolio.name}</h1>
        <h2 className="section-intro">{resume.tagline}</h2>
        <p className="section-intro">{resume.description}</p>
      </div>

      <section className="glass-card about-card resume-section">
        <h2>Experience</h2>
        {resume.experiences.map((experience) => (
          <article className="resume-entry" key={experience.id}>
            <p className="eyebrow">
              {experience.dates} · {experience.type}
            </p>
            <h3>{experience.position}</h3>
            <ul>
              {experience.bullets
                .split(",")
                .map((bullet) => bullet.trim())
                .filter(Boolean)
                .map((bullet, index) => (
                  <li key={`${experience.id}-${index}`}>{bullet}</li>
                ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="glass-card about-card resume-section">
        <h2>Education</h2>
        <h3>{resume.education.universityName}</h3>
        <p>{resume.education.universityDate}</p>
        <p>{resume.education.universityPara}</p>
      </section>

      <section className="glass-card about-card resume-section">
        <h2>Skills</h2>
        <div className="skills-list">
          {[...resume.languages, ...resume.frameworks, ...resume.others].map(
            (skill) => (
              <span className="skill-chip" key={skill}>
                <span>✦</span>
                {skill}
              </span>
            ),
          )}
        </div>
      </section>

      {process.env.NODE_ENV === "development" && (
        <p className="edit-note">
          Resume content is managed in <code>data/portfolio.json</code>. Use{" "}
          <Link href="/edit">the local editor</Link> to update it.
        </p>
      )}
    </main>
  );
}
