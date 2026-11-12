"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage("Email or password is incorrect. Please try again.");
        return;
      }

      router.replace("/admin/projects");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={handleSubmit}>
      <label className="admin-login-label" htmlFor="admin-email">
        Email address
      </label>
      <input
        autoComplete="email"
        className="admin-login-input"
        id="admin-email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        required
        type="email"
        value={email}
      />

      <label className="admin-login-label" htmlFor="admin-password">
        Password
      </label>
      <div className="admin-password-field">
        <input
          autoComplete="current-password"
          className="admin-login-input"
          id="admin-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type={passwordVisible ? "text" : "password"}
          value={password}
        />
        <button
          aria-label={passwordVisible ? "Hide password" : "Show password"}
          aria-pressed={passwordVisible}
          className="admin-password-toggle"
          onClick={() => setPasswordVisible((visible) => !visible)}
          type="button"
        >
          {passwordVisible ? "Hide" : "Show"}
        </button>
      </div>

      {errorMessage && (
        <p className="admin-login-error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        aria-busy={isSubmitting}
        className="admin-login-submit"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
      <Link className="admin-login-back" href="/">
        Back to portfolio
      </Link>
    </form>
  );
}
