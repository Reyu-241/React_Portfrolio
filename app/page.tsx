"use client";

import Link from "next/link";
import { AnimatedBackground } from "animated-backgrounds";

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

const skills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "SQL",
  "Git & GitHub",
];

export default function Home() {
  return (
    <main>
      <div className="background" aria-hidden="true">
        <AnimatedBackground
          animationName="starryNight"
          theme="portfolio"
          interactive={true}
          interactionConfig={{
            effect: "attract",
            strength: 0.45,
            radius: 130,
            continuous: false,
          }}
          adaptivePerformance={true}
          fps={30}
          style={{ opacity: 0.78 }}
        />
      </div>

      <div className="site-content">
        <header className="topbar">
          <a className="brand" href="#home" aria-label="Go to home">
            <span className="brand-mark">✦</span> Angelo Pensalfine
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
            <p className="eyebrow"><span className="status-dot" /> AVAILABLE FOR OPPORTUNITIES</p>
            <h1>
              Turning ideas into
              <span className="gradient-text"> digital experiences.</span>
            </h1>
            <p className="hero-description">
              Hi, I&apos;m <strong>[Angelo Pensalfine]</strong> — a developer who enjoys
              building useful, modern, and beautiful web applications.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">Explore my work <span>↗</span></a>
              <a className="button button-secondary" href="#contact">Get in touch</a>
            </div>
            <div className="hero-meta">
              <span><span className="tiny-star">✦</span> Based in South Africa</span>
              <span>Focused on web development</span>
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
            <h2>A little about <span className="gradient-text">my journey.</span></h2>
          </div>
          <div className="about-grid">
            <div className="glass-card about-card">
              <div className="card-icon">⌘</div>
              <h3>Who I am</h3>
              <p>
                I&apos;m a developer interested in both frontend and backend
                development. I enjoy solving problems, learning new tools, and
                turning ideas into practical applications.
              </p>
              <p className="edit-note">✎ Replace this paragraph with your own story.</p>
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
            {skills.map((skill) => <span className="skill-chip" key={skill}><span>✦</span>{skill}</span>)}
          </div>
          <p className="edit-note">✎ Edit the <code>skills</code> array near the top of <code>app/page.tsx</code>.</p>
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
          <p className="edit-note">✎ Update the <code>projects</code> array near the top of <code>app/page.tsx</code>.</p>
        </section>

        <section className="section contact-section" id="contact">
          <div className="contact-panel">
            <p className="eyebrow">04 / CONTACT</p>
            <h2>Have a project in <span className="gradient-text">mind?</span></h2>
            <p>Have an opportunity, idea, or just want to connect? Send me a message.</p>
            <a className="button button-primary" href="mailto:YOUR.EMAIL@example.com">Email me <span>↗</span></a>
            <div className="social-links">
              <a href="https://github.com/YOUR-USERNAME" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/YOUR-USERNAME" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </div>
        </section>

        <footer className="footer">
          <a className="brand" href="#home"><span className="brand-mark">✦</span> Angelo Pensalfine</a>
          <span>Designed among the stars · © {new Date().getFullYear()}</span>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
