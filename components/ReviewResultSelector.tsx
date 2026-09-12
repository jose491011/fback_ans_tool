"use client";

import { REVIEW_RESULT_COLOR, REVIEW_RESULT_LABEL, type ReviewResult } from "@/lib/types";

const OPTIONS: ReviewResult[] = ["better", "expected", "worse"];

export function ReviewResultSelector({
  value,
  onChange,
}: {
  value: ReviewResult | null;
  onChange: (v: ReviewResult) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      {OPTIONS.map((opt) => {
        const active = value === opt;
        const color = REVIEW_RESULT_COLOR[opt];
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex items-center gap-2.5 rounded-sm border px-4 py-3 min-h-[48px] text-left transition-colors flex-1"
            style={{
              borderColor: active ? color : "#D9D7D1",
              backgroundColor: active ? "#F1EFEA" : "transparent",
            }}
          >
            <span
              className="w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center"
              style={{ borderColor: color }}
            >
              {active && (
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              )}
            </span>
            <span className="text-[15px]" style={{ color: active ? color : "#1B2430" }}>
              {REVIEW_RESULT_LABEL[opt]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
