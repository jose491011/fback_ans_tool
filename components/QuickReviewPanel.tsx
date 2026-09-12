"use client";

import { useState } from "react";
import { ReviewResultSelector } from "@/components/ReviewResultSelector";
import type { ReviewResult } from "@/lib/types";

export function QuickReviewPanel({
  onConfirm,
  onCancel,
}: {
  onConfirm: (result: ReviewResult, mainReason: string, nextStep: string) => void;
  onCancel: () => void;
}) {
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [mainReason, setMainReason] = useState("");
  const [nextStep, setNextStep] = useState("");

  const canConfirm = result && mainReason.trim() && nextStep.trim();

  return (
    <div className="mt-4 rounded-md border border-line bg-surface p-5 md:p-6">
      <p className="text-[15px] font-semibold text-ink mb-4">快速檢討</p>

      <div className="mb-5">
        <label className="block text-[14px] text-muted mb-2">結果</label>
        <ReviewResultSelector value={result} onChange={setResult} />
      </div>

      <div className="mb-4">
        <label className="block text-[14px] text-muted mb-2">最大原因</label>
        <input
          value={mainReason}
          onChange={(e) => setMainReason(e.target.value)}
          placeholder="一句話說明最主要的原因"
          className="w-full min-h-[44px] rounded-sm border border-line px-3 text-[15px] text-ink focus:border-ink transition-colors"
        />
      </div>

      <div className="mb-6">
        <label className="block text-[14px] text-muted mb-2">下一步</label>
        <input
          value={nextStep}
          onChange={(e) => setNextStep(e.target.value)}
          placeholder="一句話說明接下來要做什麼"
          className="w-full min-h-[44px] rounded-sm border border-line px-3 text-[15px] text-ink focus:border-ink transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => canConfirm && onConfirm(result, mainReason.trim(), nextStep.trim())}
          className="min-h-[44px] px-5 rounded-sm bg-ink text-paper text-[15px] font-medium disabled:opacity-40 transition-colors hover:bg-[#28344a]"
        >
          完成這次檢討
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
