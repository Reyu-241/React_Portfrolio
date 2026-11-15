export type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  website: string;
};

export function validateContactSubmission(
  value: unknown,
): ContactSubmission | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const input = value as Record<string, unknown>;
  if (
    typeof input.name !== "string" ||
    typeof input.email !== "string" ||
    typeof input.message !== "string" ||
    typeof input.website !== "string"
  ) {
    return null;
  }

  const submission = {
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
    website: input.website.trim(),
  };

  if (
    !submission.name ||
    submission.name.length > 120 ||
    submission.email.length < 3 ||
    submission.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(submission.email) ||
    !submission.message ||
    submission.message.length > 5000 ||
    submission.website
  ) {
    return null;
  }

  return submission;
}
