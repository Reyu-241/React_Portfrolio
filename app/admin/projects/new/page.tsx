import Link from "next/link";
import ProjectForm from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <main className="admin-main">
      <div className="admin-content admin-form-content">
        <Link className="admin-back-link" href="/admin/projects">
          &larr; Back to projects
        </Link>
        <p className="eyebrow">PORTFOLIO CONTENT</p>
        <h1>Add a project</h1>
        <ProjectForm />
      </div>
    </main>
  );
}
