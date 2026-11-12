import Link from "next/link";
import LoginForm from "./login-form";

export default function AdminLoginPage() {
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
