import Link from "next/link";
import ContactForm from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <main className="admin-login-main">
      <section className="admin-login-card">
        <Link className="admin-login-brand" href="/">
          <span aria-hidden="true" className="brand-mark">✦</span>
          PORTFOLIO
        </Link>
        <p className="eyebrow admin-login-eyebrow">LET&apos;S WORK TOGETHER</p>
        <h1 className="admin-login-title">Send a commission</h1>
        <p className="admin-login-description">
          Tell me a little about your project and I&apos;ll get back to you.
        </p>
        <ContactForm />
      </section>
    </main>
  );
}
