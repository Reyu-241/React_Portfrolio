import { notFound } from "next/navigation";
import BlogEditor from "@/components/BlogEditor";

export default function NewBlogPostPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <BlogEditor />;
}
