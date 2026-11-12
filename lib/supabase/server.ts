import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies; middleware handles refreshes.
        }
      },
    },
  });
}

export async function requirePortfolioOwner() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError && userError.name !== "AuthSessionMissingError") {
    throw new Error(`Unable to verify your Supabase session: ${userError.message}`);
  }

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isOwner, error: ownerError } = await supabase.rpc(
    "is_portfolio_owner",
  );

  if (ownerError) {
    throw new Error(`Unable to verify portfolio access: ${ownerError.message}`);
  }

  if (!isOwner) {
    redirect("/");
  }

  return supabase;
}
