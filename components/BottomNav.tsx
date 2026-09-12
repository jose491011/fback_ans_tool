"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListChecks, Archive, Plus, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/reviews", label: "待回顧", icon: ListChecks },
  { href: "/history", label: "所有紀錄", icon: Archive },
  { href: "/predictions/new", label: "新增", icon: Plus },
  { href: "/settings", label: "設定", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-surface border-t border-line flex">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] text-[12px] ${
              active ? "text-ink" : "text-muted"
            }`}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
