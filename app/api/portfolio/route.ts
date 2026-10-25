import { writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return Response.json(
      { error: "Portfolio data must be a JSON object." },
      { status: 400 },
    );
  }

  try {
    await writeFile(
      path.join(process.cwd(), "data", "portfolio.json"),
      `${JSON.stringify(data, null, 2)}\n`,
      "utf8",
    );
    return Response.json({ saved: true });
  } catch (error) {
    console.error("Failed to save portfolio data.", error);
    return Response.json(
      { error: "Portfolio data could not be saved." },
      { status: 500 },
    );
  }
}
