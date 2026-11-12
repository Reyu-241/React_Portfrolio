"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DeleteProjectButton({ id }: { id: string }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function deleteProject() {
    if (!window.confirm("Permanently delete this project?")) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");
    const { error } = await createClient()
      .from("projects")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      setErrorMessage(`Project could not be deleted: ${error.message}`);
      setIsDeleting(false);
      return;
    }

    router.replace("/admin/projects");
    router.refresh();
  }

  return (
    <>
      <button
        className="admin-delete-button"
        disabled={isDeleting}
        onClick={deleteProject}
        type="button"
      >
        {isDeleting ? "Deleting..." : "Delete project"}
      </button>
      {errorMessage && (
        <p className="admin-error" role="alert">
          {errorMessage}
        </p>
      )}
    </>
  );
}
