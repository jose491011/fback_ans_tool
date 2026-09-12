"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, Archive, BarChart2, Settings } from "lucide-react";

const NAV_ITEMS = [
  { href: "/home", label: "首頁", icon: Home },
  { href: "/reviews", label: "待回顧", icon: ListChecks },
  { href: "/history", label: "所有紀錄", icon: Archive },
  { href: "/analytics", label: "分析", icon: BarChart2 },
  { href: "/settings", label: "設定", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-[200px] md:flex-shrink-0 md:flex-col bg-surface border-r border-line">
      <div className="px-6 pt-7 pb-6">
        <div className="font-serif text-lg font-semibold text-ink tracking-wide">PDA</div>
        <div className="mt-1 h-px w-8 bg-line" />
      </div>
      <nav className="flex-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-sm px-3 py-2.5 mb-1 text-[15px] transition-colors ${
                active
                  ? "bg-paper text-ink border-l-2 border-ink -ml-[2px] pl-[14px]"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Icon size={19} strokeWidth={1.75} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
