import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LoginForm from "./login-form";

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError && userError.name !== "AuthSessionMissingError") {
    throw new Error(`Unable to verify your Supabase session: ${userError.message}`);
  }

  if (user) {
    const { data: isOwner, error } = await supabase.rpc("is_portfolio_owner");
    if (error) {
      throw new Error(`Unable to verify portfolio access: ${error.message}`);
    }
    if (isOwner) {
      redirect("/admin/homepage");
    }
  }

  return (
    <main className="admin-login-main">
      <div className="admin-login-card">
        <Link className="admin-login-brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            ✦
          </span>
          PORTFOLIO ADMIN
        </Link>
        <p className="eyebrow admin-login-eyebrow">OWNER ACCESS</p>
        <h1 className="admin-login-title">Welcome back</h1>
        <p className="admin-login-description">
          Sign in with your portfolio owner account to continue.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
