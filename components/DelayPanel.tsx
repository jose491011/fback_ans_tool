"use client";

import { useState } from "react";
import { addDaysISO } from "@/lib/date";
import { DELAY_REASON_LABEL, type DelayReason } from "@/lib/types";

const REASONS = Object.keys(DELAY_REASON_LABEL) as DelayReason[];

export function DelayPanel({
  currentDueDate,
  reviewPeriodDays,
  onConfirm,
  onCancel,
}: {
  currentDueDate: string;
  reviewPeriodDays: number;
  onConfirm: (reason: DelayReason, newDueDate: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState<DelayReason | null>(null);
  const [newDate, setNewDate] = useState(addDaysISO(currentDueDate, reviewPeriodDays));

  return (
    <div className="mt-4 rounded-md border border-line bg-surface p-5 md:p-6">
      <p className="text-[15px] font-semibold text-ink mb-4">延後檢討</p>

      <div className="mb-2 text-[14px] text-muted">延後原因</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
        {REASONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setReason(r)}
            className="flex items-center gap-2.5 rounded-sm border px-3 py-2.5 min-h-[44px] text-left text-[14px] transition-colors"
            style={{
              borderColor: reason === r ? "#1B2430" : "#D9D7D1",
              backgroundColor: reason === r ? "#F7F5F0" : "transparent",
              color: "#1B2430",
            }}
          >
            <span
              className="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center"
              style={{ borderColor: "#1B2430" }}
            >
              {reason === r && <span className="w-1.5 h-1.5 rounded-full bg-ink" />}
            </span>
            {DELAY_REASON_LABEL[r]}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-[14px] text-muted mb-2">下一個檢討日期</label>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="border border-line rounded-sm px-3 py-2.5 text-[15px] text-ink w-full sm:w-auto min-h-[44px]"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!reason}
          onClick={() => reason && onConfirm(reason, newDate)}
          className="min-h-[44px] px-5 rounded-sm bg-ink text-paper text-[15px] font-medium disabled:opacity-40 transition-colors hover:bg-[#28344a]"
        >
          確認延後
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-[44px] px-5 rounded-sm text-[15px] text-muted hover:text-ink transition-colors"
        >
          取消
        </button>
      </div>
    </div>
  );
}
