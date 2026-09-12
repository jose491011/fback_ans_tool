"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { HistoryListItem } from "@/components/HistoryListItem";
import { EmptyState } from "@/components/EmptyState";
import { usePredictionStore } from "@/lib/store";

export default function HistoryPage() {
  const { predictions } = usePredictionStore();

  const sorted = useMemo(
    () => [...predictions].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [predictions]
  );

  return (
    <div>
      <PageHeader title="所有紀錄" subtitle="每一張卡片，都是一次判斷的紀錄。" />

      {sorted.length === 0 ? (
        <EmptyState title="還沒有任何紀錄" subtitle="從第一張預測卡開始，累積屬於你的判斷紀錄。" />
      ) : (
        <div>
          {sorted.map((p) => (
            <HistoryListItem key={p.id} prediction={p} />
          ))}
        </div>
      )}
    </div>
  );
}
