import Link from "next/link";
import Galaxy from "@/components/Galaxy";
import {
  defaultHomepageContent,
  isHomepageContent,
  isHomepageContentTableMissing,
} from "@/lib/homepage-content";
import { createClient } from "@/lib/supabase/server";

const projects = [
  {
    name: "Clinic Operations Dashboard",
    description:
      "A dashboard for managing patient records, appointments, and treatments.",
    tags: ["Next.js", "TypeScript", "SQL"],
    link: "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY",
  },
  {
    name: "Project Two",
    description:
      "Replace this with a short explanation of another project you have built.",
    tags: ["React", "CSS", "API"],
    link: "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY",
  },
  {
    name: "Project Three",
    description:
      "Use this card to highlight a project you are especially proud of.",
    tags: ["Python", "Automation"],
    link: "https://github.com/YOUR-USERNAME/YOUR-REPOSITORY",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_content")
    .select("content")
    .eq("id", true)
    .maybeSingle();

  if (error && !isHomepageContentTableMissing(error)) {
    throw new Error(`Homepage content could not be loaded: ${error.message}`);
  }

  if (error) {
    console.warn(
      "Homepage content storage is unavailable. Apply the homepage_content Supabase migration to enable saved content.",
      error,
    );
  }

  const content = (error ? undefined : data?.content) ?? defaultHomepageContent;
  if (!isHomepageContent(content)) {
    throw new Error("Saved homepage content has an invalid format.");
  }

  return (
    <main>
      <div className="background" aria-hidden="true">
        <Galaxy
          density={1.05}
          glowIntensity={0.51}
          flareIntensity={1.4}
          starSpeed={0.5}
          mouseRepulsion
          clickWarp={false}
          starColors={["#ffffff", "#44bcd0", "#b895f5", "#dffaff"]}
          hueShift={38}
          starSize={1.25}
          twinkleIntensity={0.42}
        />
      </div>

      <div className="site-content">
        <header className="topbar">
          <a className="brand" href="#home" aria-label="Go to home">
            <span className="brand-mark">✦</span> {content.name}
          </a>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <Link href="/blog">Blog</Link>
            <Link href="/resume">Resume</Link>
            <a className="nav-contact" href="#contact">Contact ↗</a>
          </nav>
        </header>

        <section className="hero section" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> {content.availability}</p>
            <h1>
              {content.headline}
              <span className="gradient-text">{content.headlineHighlight}</span>
            </h1>
            <p className="hero-description">
              {content.introduction}
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore my work <span>↗</span></a>
              <a className="button button-secondary" href="#contact">Get in touch</a>
            </div>
            <div className="hero-meta">
              <span><span className="tiny-star">✦</span> {content.location}</span>
              <span>{content.focus}</span>
            </div>
          </div>
          <div className="orbit-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="planet">
              <div className="planet-glow" />
            </div>
            <span className="orbit-star star-one">✦</span>
            <span className="orbit-star star-two">✧</span>
            <span className="orbit-star star-three">✦</span>
            <span className="orbit-label">CREATING<br />SOMETHING NEW</span>
          </div>
          <a className="scroll-cue" href="#about"><span /> SCROLL TO EXPLORE</a>
        </section>

        <section className="section about-section" id="about">
          <div className="section-heading">
            <p className="eyebrow">01 / ABOUT ME</p>
            <h2>{content.aboutHeading}</h2>
          </div>
          <div className="about-grid">
            <div className="glass-card about-card">
              <div className="card-icon">⌘</div>
              <h3>Who I am</h3>
              <p>
                {content.aboutDescription}
              </p>
            </div>
            <div className="about-stats">
              <div className="glass-card stat-card"><strong>01</strong><span>Curiosity first</span></div>
              <div className="glass-card stat-card"><strong>∞</strong><span>Things to learn</span></div>
              <div className="glass-card stat-card"><strong>✦</strong><span>Built with purpose</span></div>
            </div>
          </div>
        </section>

        <section className="section" id="skills">
          <div className="section-heading">
            <p className="eyebrow">02 / TOOLKIT</p>
            <h2>Technologies I <span className="gradient-text">work with.</span></h2>
            <p className="section-intro">A selection of tools I use and continue to develop my skills in.</p>
          </div>
          <div className="skills-list">
            {content.skills.map((skill) => <span className="skill-chip" key={skill}><span>✦</span>{skill}</span>)}
          </div>
        </section>

        <section className="section" id="projects">
          <div className="section-heading projects-heading">
            <div>
              <p className="eyebrow">03 / SELECTED WORK</p>
              <h2>Projects from my <span className="gradient-text">universe.</span></h2>
            </div>
            <a className="text-link" href="https://github.com/YOUR-USERNAME">View GitHub ↗</a>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article className="glass-card project-card" key={project.name}>
                <div className="project-topline">
                  <span className="project-number">PROJECT / 0{index + 1}</span>
                  <span className="project-symbol">↗</span>
                </div>
                <div className={`project-visual visual-${index + 1}`} aria-hidden="true">
                  <div className="visual-orb" />
                  <div className="visual-line" />
                  <span>✦</span>
                </div>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <a className="project-link" href={project.link} target="_blank" rel="noreferrer">
                  View project <span>↗</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-panel">
            <p className="eyebrow">04 / CONTACT</p>
            <h2>{content.contactHeading}</h2>
            <p>{content.contactDescription}</p>
            <Link className="button button-primary" href="/contact">Send a commission <span>↗</span></Link>
            <div className="social-links">
              <a href={`mailto:${content.contactEmail}`}>Email ↗</a>
              <a href={content.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href={content.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <a className="brand" href="#home"><span className="brand-mark">✦</span> {content.name}</a>
          <span>Designed among the stars · © {new Date().getFullYear()}</span>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
