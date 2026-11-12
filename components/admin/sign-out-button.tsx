"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const { error } = await createClient().auth.signOut();
    if (error) {
      window.alert(`Unable to sign out: ${error.message}`);
      return;
    }

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button className="admin-signout" onClick={signOut} type="button">
      Sign out
    </button>
  );
}
