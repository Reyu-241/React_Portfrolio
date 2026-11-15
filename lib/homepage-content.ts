export type HomepageContent = {
  name: string;
  availability: string;
  headline: string;
  headlineHighlight: string;
  introduction: string;
  location: string;
  focus: string;
  aboutHeading: string;
  aboutDescription: string;
  skills: string[];
  contactHeading: string;
  contactDescription: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
};

export const defaultHomepageContent: HomepageContent = {
  name: "Angelo Pensalfine",
  availability: "AVAILABLE FOR OPPORTUNITIES",
  headline: "Turning ideas into",
  headlineHighlight: " digital experiences.",
  introduction:
    "Hi, I'm Angelo Pensalfine — a developer who enjoys building useful, modern, and beautiful web applications.",
  location: "Based in South Africa",
  focus: "Focused on web development",
  aboutHeading: "A little about my journey.",
  aboutDescription:
    "I'm a developer interested in both frontend and backend development. I enjoy solving problems, learning new tools, and turning ideas into practical applications.",
  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Python",
    "SQL",
    "Git & GitHub",
  ],
  contactHeading: "Have a project in mind?",
  contactDescription:
    "Have an opportunity, idea, or just want to connect? Send me a message.",
  contactEmail: "YOUR.EMAIL@example.com",
  githubUrl: "https://github.com/YOUR-Reyu-241",
  linkedinUrl: "https://www.linkedin.com/in/YOUR-USERNAME",
};

export function isHomepageContentTableMissing(error: { code?: string }) {
  return error.code === "42P01" || error.code === "PGRST205";
}

export function isHomepageContent(value: unknown): value is HomepageContent {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const content = value as Record<string, unknown>;
  const textFields: (keyof Omit<HomepageContent, "skills">)[] = [
    "name",
    "availability",
    "headline",
    "headlineHighlight",
    "introduction",
    "location",
    "focus",
    "aboutHeading",
    "aboutDescription",
    "contactHeading",
    "contactDescription",
    "contactEmail",
    "githubUrl",
    "linkedinUrl",
  ];

  return (
    textFields.every((field) => typeof content[field] === "string") &&
    Array.isArray(content.skills) &&
    content.skills.every((skill) => typeof skill === "string")
  );
}
