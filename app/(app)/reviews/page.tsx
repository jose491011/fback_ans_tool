"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { FilterTabs } from "@/components/FilterTabs";
import { ReviewListItem } from "@/components/ReviewListItem";
import { EmptyState } from "@/components/EmptyState";
import { usePredictionStore } from "@/lib/store";
import { daysFromToday, isOverdue, isUpcoming } from "@/lib/date";

type FilterKey = "all" | "overdue" | "upcoming";

export default function ReviewsPage() {
  const { predictions } = usePredictionStore();
  const [filter, setFilter] = useState<FilterKey>("all");

  const pending = useMemo(
    () =>
      predictions
        .filter((p) => p.status === "pending")
        .sort((a, b) => daysFromToday(b.reviewDueDate) - daysFromToday(a.reviewDueDate)),
    [predictions]
  );

  const overdueList = pending.filter((p) => isOverdue(p.reviewDueDate));
  const upcomingList = pending.filter((p) => isUpcoming(p.reviewDueDate));

  const visible =
    filter === "overdue" ? overdueList : filter === "upcoming" ? upcomingList : pending;

  return (
    <div>
      <PageHeader
        title="待回顧"
        subtitle="回頭看看，驗證你的判斷，從經驗中成長。"
        action={
          <Link
            href="/predictions/new"
            className="min-h-[44px] flex items-center px-5 rounded-sm bg-ink text-paper text-[15px] font-medium hover:bg-[#28344a] transition-colors"
          >
            ＋ 新增預測
          </Link>
        }
      />

      <FilterTabs
        options={[
          { key: "all", label: "全部", count: pending.length },
          { key: "overdue", label: "已逾期", count: overdueList.length },
          { key: "upcoming", label: "即將到期", count: upcomingList.length },
        ]}
        active={filter}
        onChange={(k) => setFilter(k as FilterKey)}
      />

      {visible.length === 0 ? (
        <EmptyState
          title="暫時沒有需要回頭看的決定"
          subtitle="每一次檢討，都是讓自己更清楚的一步。"
        />
      ) : (
        <div>
          {visible.map((p) => (
            <ReviewListItem key={p.id} prediction={p} />
          ))}
        </div>
      )}
    </div>
  );
}
