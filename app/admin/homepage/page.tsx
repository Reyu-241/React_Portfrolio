import AdminShell from "@/components/admin/admin-shell";
import HomepageEditor from "@/components/admin/homepage-editor";
import {
  defaultHomepageContent,
  isHomepageContent,
  isHomepageContentTableMissing,
} from "@/lib/homepage-content";
import { requirePortfolioOwner } from "@/lib/supabase/server";

export default async function AdminHomepagePage() {
  const supabase = await requirePortfolioOwner();
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
      "Homepage content storage is unavailable. Apply the homepage_content Supabase migration before saving content.",
      error,
    );
  }

  const content = (error ? undefined : data?.content) ?? defaultHomepageContent;
  if (!isHomepageContent(content)) {
    throw new Error("Saved homepage content has an invalid format.");
  }

  return (
    <AdminShell>
      <HomepageEditor content={content} />
    </AdminShell>
  );
}
