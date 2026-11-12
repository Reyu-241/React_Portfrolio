import AdminShell from "@/components/admin/admin-shell";
import { requirePortfolioOwner } from "@/lib/supabase/server";

export default async function AdminMessagesPage() {
  const supabase = await requirePortfolioOwner();
  const { data: messages, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-page-heading">
            <div>
              <p className="eyebrow">INBOX</p>
              <h1>Contact messages</h1>
              <p className="admin-muted">
                Messages submitted through your portfolio contact form.
              </p>
            </div>
          </div>

          {error ? (
            <p className="admin-error" role="alert">
              Messages could not be loaded: {error.message}
            </p>
          ) : messages.length === 0 ? (
            <section className="admin-empty glass-card">
              <h2>Your inbox is empty</h2>
              <p className="admin-muted">
                New contact form submissions will appear here.
              </p>
            </section>
          ) : (
            <div className="admin-project-list">
              {messages.map((message) => (
                <article className="admin-message-card glass-card" key={message.id}>
                  <div className="admin-project-meta">
                    <a className="admin-email" href={`mailto:${message.email}`}>
                      {message.email}
                    </a>
                    <time dateTime={message.created_at}>
                      {new Date(message.created_at).toLocaleString()}
                    </time>
                  </div>
                  <h2>{message.name}</h2>
                  <p className="admin-message-body">{message.message}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminShell>
  );
}
