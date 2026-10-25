export type BlogPostMetadata = {
  date: string;
  title: string;
  tagline: string;
  preview: string;
  image: string;
};

export type BlogPost = BlogPostMetadata & {
  slug: string;
  content: string;
};
