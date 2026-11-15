"use client";

import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          website: formData.get("website"),
        }),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        const error =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Your message could not be sent.";
        throw new Error(error);
      }

      form.reset();
      setStatus("Thanks! Your commission inquiry has been sent.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Your message could not be sent. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label className="admin-login-label" htmlFor="contact-name">Name</label>
      <input
        className="admin-login-input"
        id="contact-name"
        maxLength={120}
        name="name"
        required
      />
      <label className="admin-login-label" htmlFor="contact-email">Email</label>
      <input
        autoComplete="email"
        className="admin-login-input"
        id="contact-email"
        maxLength={254}
        name="email"
        required
        type="email"
      />
      <label className="admin-login-label" htmlFor="contact-message">
        Project details
      </label>
      <textarea
        className="admin-login-input contact-message-input"
        id="contact-message"
        maxLength={5000}
        name="message"
        required
        rows={6}
      />
      <div aria-hidden="true" className="contact-honeypot">
        <label htmlFor="contact-website">Website</label>
        <input
          autoComplete="off"
          id="contact-website"
          name="website"
          tabIndex={-1}
        />
      </div>
      {status && <p role="status">{status}</p>}
      <button
        aria-busy={isSubmitting}
        className="admin-login-submit"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Sending..." : "Send inquiry"}
      </button>
    </form>
  );
}
