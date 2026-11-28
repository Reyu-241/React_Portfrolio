export type CaseStudy = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  description: string;
  technologies: string[];
  repository: string;
  screenshots?: {
    src: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  }[];
  sections: {
    heading: string;
    description: string;
  }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "pokedex",
    number: "01",
    title: "Pokedex",
    summary: "A Pokémon project built with JavaScript, CSS, and HTML.",
    description:
      "A browser-based project exploring how JavaScript, HTML, and CSS work together to create a Pokémon experience.",
    technologies: ["JavaScript", "CSS", "HTML"],
    repository: "https://github.com/Reyu-241/Pokedex",
    screenshots: [
      {
        src: "/images/projects/pokedex-1.png",
        alt: "Pokémon of South Africa page with filters and Pokémon cards.",
        caption: "Browse and filter Pokémon",
        width: 1542,
        height: 840,
      },
      {
        src: "/images/projects/pokedex-2.png",
        alt: "Pokémon team builder with selected Pokémon, move selectors, and stats.",
        caption: "Build a team and choose moves",
        width: 1157,
        height: 827,
      },
    ],
    sections: [
      {
        heading: "Project overview",
        description:
          "Pokedex is a frontend project centered on the Pokémon universe, built with core web technologies.",
      },
      {
        heading: "Implementation",
        description:
          "JavaScript brings the project behavior together, while HTML and CSS provide the structure and presentation.",
      },
      {
        heading: "What I learned",
        description:
          "This project provided hands-on practice combining browser fundamentals into a complete, shareable project.",
      },
    ],
  },
  {
    slug: "yellow-game",
    number: "02",
    title: "Yellow Game",
    summary: "A game project built with Python and HTML.",
    description:
      "A game project that combines Python and HTML, bringing programming practice together with a web-based interface.",
    technologies: ["Python", "HTML"],
    repository: "https://github.com/Reyu-241/Yellow-Game",
    sections: [
      {
        heading: "Project overview",
        description:
          "Yellow Game is a game project built with Python and HTML.",
      },
      {
        heading: "Implementation",
        description:
          "The project brings together Python code and HTML, giving me practice working across both technologies.",
      },
      {
        heading: "What I learned",
        description:
          "Building this project helped me explore how different technologies can contribute to one cohesive experience.",
      },
    ],
  },
  {
    slug: "clinic-dashboard",
    number: "03",
    title: "Clinic Operations Dashboard",
    summary:
      "A clinic dashboard for patient records, appointments, treatments, and operational insights.",
    description:
      "A clinic management app that helps a small clinic owner manage patient records and appointments, with charts to track patient growth and appointment status.",
    technologies: ["Next.js", "TypeScript", "Supabase", "PostgreSQL"],
    repository: "https://github.com/Reyu-241/clinic-dashboard",
    screenshots: [
      {
        src: "/images/projects/clinic-1.png",
        alt: "Clinic appointment booking form with patient and appointment details.",
        caption: "Book a clinic appointment",
        width: 705,
        height: 852,
      },
      {
        src: "/images/projects/clinic-2.png",
        alt: "Clinic dashboard showing patient and appointment summaries, charts, and quick links.",
        caption: "Review clinic activity and appointment status",
        width: 1882,
        height: 845,
      },
    ],
    sections: [
      {
        heading: "The challenge",
        description:
          "Clinic owners need a clear way to manage patient records and appointments, and to understand appointment status and patient growth.",
      },
      {
        heading: "The solution",
        description:
          "The dashboard brings patient, appointment, and treatment records together. Its charts summarize new patients over six months and the current month's appointment statuses.",
      },
      {
        heading: "Privacy and access",
        description:
          "Authentication and user-scoped data access help keep clinic records isolated. The project is intended for fictional demo data, not real patient information.",
      },
    ],
  },
];
