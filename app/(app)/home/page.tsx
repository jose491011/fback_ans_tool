"use client";

import Link from "next/link";
import { usePredictionStore } from "@/lib/store";
import { isOverdue } from "@/lib/date";

export default function HomePage() {
  const { predictions } = usePredictionStore();
  const pending = predictions.filter((p) => p.status === "pending");
  const overdueCount = pending.filter((p) => isOverdue(p.reviewDueDate)).length;

  return (
    <div className="max-w-content">
      <p className="text-[14px] text-muted mb-3">
        {new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
      </p>
      <h1 className="font-serif text-[30px] md:text-[40px] font-semibold text-ink leading-tight">
        今天，也是檢討判斷的好時機
      </h1>
      <p className="mt-3 text-[16px] text-muted max-w-[520px] leading-relaxed">
        {overdueCount > 0
          ? `目前有 ${overdueCount} 張卡片已逾期，找個安靜的時間回頭看看。`
          : pending.length > 0
          ? `目前有 ${pending.length} 張卡片還在等待檢討。`
          : "目前沒有待處理的卡片，可以寫下一個新的判斷。"}
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-3">
        <Link
          href="/reviews"
          className="min-h-[48px] flex items-center justify-center px-6 rounded-sm border border-line text-[15px] text-ink hover:border-ink transition-colors"
        >
          前往待回顧
        </Link>
        <Link
          href="/predictions/new"
          className="min-h-[48px] flex items-center justify-center px-6 rounded-sm bg-ink text-paper text-[15px] font-medium hover:bg-[#28344a] transition-colors"
        >
          ＋ 新增預測
        </Link>
        <Link
          href="/history"
          className="min-h-[48px] flex items-center justify-center px-6 rounded-sm border border-line text-[15px] text-ink hover:border-ink transition-colors"
        >
          查看所有紀錄
        </Link>
      </div>

      <p className="mt-16 text-[14px] text-muted italic">
        「真正的成長，來自於誠實地回顧。」
      </p>
    </div>
  );
}
