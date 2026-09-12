"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function TopBar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const initial = email ? email[0].toUpperCase() : "";

  return (
    <header className="flex items-center justify-between border-b border-line px-5 md:px-8 h-14 md:h-16 bg-paper">
      <div className="flex items-center gap-2 text-ink">
        <span className="font-serif text-[15px] font-semibold">PDA</span>
        <span className="hidden sm:inline text-line">|</span>
        <span className="hidden sm:inline text-[14px] text-muted">個人決策回饋分析法工具</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-[13px] text-ink">你好</span>
          <span className="text-[12px] text-muted">專注思考，持續前進</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center text-[13px] font-medium">
          {initial}
        </div>
      </div>
    </header>
  );
}
