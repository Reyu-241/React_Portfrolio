import Link from "next/link";
import SignOutButton from "@/components/admin/sign-out-button";

export default function AdminShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="admin-shell">
      <header className="admin-header">
        <Link className="admin-shell-brand" href="/admin/homepage">
          <span aria-hidden="true" className="brand-mark">
            ✦
          </span>
          PORTFOLIO ADMIN
        </Link>
        <nav aria-label="Admin navigation" className="admin-nav">
          <Link href="/admin/homepage">Homepage</Link>
          <Link href="/admin/projects">Projects</Link>
          <Link href="/admin/case-studies">Case Studies</Link>
          <Link href="/admin/blog">Blog</Link>
          <Link href="/admin/messages">Commissions</Link>
          <SignOutButton />
        </nav>
      </header>
      {children}
    </section>
  );
}
