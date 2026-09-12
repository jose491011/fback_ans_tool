"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SectionLabel } from "@/components/SectionLabel";
import { DelayPanel } from "@/components/DelayPanel";
import { QuickReviewPanel } from "@/components/QuickReviewPanel";
import { usePredictionStore } from "@/lib/store";
import { formatDateSlash } from "@/lib/date";
import { REVIEW_RESULT_COLOR, REVIEW_RESULT_LABEL } from "@/lib/types";

export default function PredictionDetailPage() {
  const params = useParams<{ id: string }>();
  const { getPrediction, delayPrediction, submitQuickReview, loading } = usePredictionStore();
  const [delayOpen, setDelayOpen] = useState(false);
  const [delayError, setDelayError] = useState<string | null>(null);
  const [quickReviewOpen, setQuickReviewOpen] = useState(false);
  const [quickReviewError, setQuickReviewError] = useState<string | null>(null);

  const prediction = getPrediction(params.id);

  if (loading) return null;

  if (!prediction) {
    return (
      <div className="py-16 text-center text-muted text-[15px]">找不到這張卡片。</div>
    );
  }

  return (
    <div className="max-w-content">
      <p className="text-[13px] text-muted mb-6">
        建卡日期 {formatDateSlash(prediction.createdAt.slice(0, 10))}
      </p>

      <div className="mb-8">
        <SectionLabel>決策／行動</SectionLabel>
        <p className="font-serif text-[19px] text-ink leading-relaxed">
          {prediction.decisionContent}
        </p>
      </div>

      <div className="mb-8">
        <SectionLabel>預期結果</SectionLabel>
        <p className="text-[16px] text-ink leading-relaxed">{prediction.expectedOutcome}</p>
      </div>

      <div className="mb-8">
        <SectionLabel>成功判斷標準</SectionLabel>
        <p className="text-[16px] text-ink leading-relaxed">{prediction.successCriteria}</p>
      </div>

      <div className="mb-8">
        <SectionLabel>我為什麼認為會成功</SectionLabel>
        <p className="text-[16px] text-ink leading-relaxed">{prediction.successReason}</p>
      </div>

      <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div>
          <p className="text-[13px] text-muted mb-1">目前狀態</p>
          <p className="text-[15px] text-ink">
            {prediction.status === "reviewed" ? "已檢討" : "待檢討"}
          </p>
        </div>
        <div>
          <p className="text-[13px] text-muted mb-1">原訂檢討日期</p>
          <p className="text-[15px] text-ink">{formatDateSlash(prediction.reviewDueDate)}</p>
        </div>
        {prediction.delayCount > 0 && (
          <div>
            <p className="text-[13px] text-muted mb-1">延後次數</p>
            <p className="text-[15px] text-ink">{prediction.delayCount} 次</p>
          </div>
        )}
        {prediction.quickReviewResult && (
          <div>
            <p className="text-[13px] text-muted mb-1">檢討結果</p>
            <p
              className="text-[15px] font-medium"
              style={{ color: REVIEW_RESULT_COLOR[prediction.quickReviewResult] }}
            >
              {REVIEW_RESULT_LABEL[prediction.quickReviewResult]}
            </p>
          </div>
        )}
      </div>

      {prediction.status === "pending" ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              setQuickReviewOpen((v) => !v);
              setDelayOpen(false);
            }}
            className="min-h-[48px] flex items-center justify-center px-6 rounded-sm bg-ink text-paper text-[15px] font-medium hover:bg-[#28344a] transition-colors"
          >
            快速檢討
          </button>
          <button
            type="button"
            onClick={() => {
              setDelayOpen((v) => !v);
              setQuickReviewOpen(false);
            }}
            className="min-h-[48px] flex items-center justify-center px-6 rounded-sm border border-line text-[15px] text-ink hover:border-ink transition-colors"
          >
            延後檢討
          </button>
        </div>
      ) : (
        <Link
          href={`/predictions/${prediction.id}/deep-analysis`}
          className="min-h-[48px] inline-flex items-center justify-center px-6 rounded-sm border border-line text-[15px] text-ink hover:border-ink transition-colors"
        >
          {prediction.deepAnalysis ? "查看深入分析" : "寫深入分析"}
        </Link>
      )}

      {quickReviewOpen && (
        <QuickReviewPanel
          onCancel={() => setQuickReviewOpen(false)}
          onConfirm={async (result, mainReason, nextStep) => {
            try {
              await submitQuickReview(prediction.id, result, mainReason, nextStep);
              setQuickReviewOpen(false);
              setQuickReviewError(null);
            } catch (err) {
              setQuickReviewError(err instanceof Error ? err.message : "儲存失敗，請稍後再試。");
            }
          }}
        />
      )}
      {quickReviewError && (
        <p className="mt-3 text-[14px]" style={{ color: "#B85F50" }}>{quickReviewError}</p>
      )}

      {delayOpen && (
        <DelayPanel
          currentDueDate={prediction.reviewDueDate}
          reviewPeriodDays={prediction.reviewPeriodDays}
          onCancel={() => setDelayOpen(false)}
          onConfirm={async (reason, newDate) => {
            try {
              await delayPrediction(prediction.id, reason, newDate);
              setDelayOpen(false);
              setDelayError(null);
            } catch (err) {
              setDelayError(err instanceof Error ? err.message : "延後失敗，請稍後再試。");
            }
          }}
        />
      )}
      {delayError && (
        <p className="mt-3 text-[14px]" style={{ color: "#B85F50" }}>{delayError}</p>
      )}
    </div>
  );
}
