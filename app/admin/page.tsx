import { redirect } from "next/navigation";
import { requirePortfolioOwner } from "@/lib/supabase/server";

export default async function AdminPage() {
  await requirePortfolioOwner();
  redirect("/admin/homepage");
}
