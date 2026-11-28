import AdminShell from "@/components/admin/admin-shell";
import { requirePortfolioOwner } from "@/lib/supabase/server";

export default async function AdminBlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requirePortfolioOwner();
  return <AdminShell>{children}</AdminShell>;
}
