"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/lib/supabaseClient";
import { signOut } from "@/lib/auth";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div>
      <PageHeader title="設定" />
      <div className="max-w-[420px]">
        <div className="pb-5 mb-5 border-b border-line">
          <p className="text-[13px] text-muted mb-1">電子郵件</p>
          <p className="text-[15px] text-ink">{email ?? "—"}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="min-h-[44px] px-5 rounded-sm border border-line text-[15px] text-ink hover:border-ink transition-colors"
        >
          登出
        </button>
      </div>
    </div>
  );
}
