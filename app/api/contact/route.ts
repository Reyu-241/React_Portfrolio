import { createClient } from "@/lib/supabase/server";
import { validateContactSubmission } from "@/lib/validation/contact";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const submission = validateContactSubmission(body);
  if (!submission) {
    return Response.json(
      { error: "Please check your name, email, and message and try again." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .insert(submission);

  if (error) {
    console.error("Contact submission could not be saved.", error);
    return Response.json(
      {
        error:
          "Your message could not be sent right now. Please try again later.",
      },
      { status: 500 },
    );
  }

  return Response.json({ submitted: true }, { status: 201 });
}
