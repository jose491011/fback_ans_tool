"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addDaysISO, formatDateLong, todayISO } from "@/lib/date";
import { usePredictionStore } from "@/lib/store";

const PERIOD_OPTIONS = [7, 30, 90];

const fieldClass =
  "w-full rounded-sm border border-line px-4 py-3 text-[16px] text-ink placeholder:text-muted/70 focus:border-ink transition-colors";

export function PredictionForm() {
  const router = useRouter();
  const { addPrediction } = usePredictionStore();

  const [decisionContent, setDecisionContent] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [successCriteria, setSuccessCriteria] = useState("");
  const [successReason, setSuccessReason] = useState("");
  const [period, setPeriod] = useState<number>(30);
  const [customDays, setCustomDays] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectivePeriod = customDays ? Number(customDays) : period;
  const previewDate = useMemo(() => {
    if (!effectivePeriod || Number.isNaN(effectivePeriod)) return null;
    return addDaysISO(todayISO(), effectivePeriod);
  }, [effectivePeriod]);

  const canSubmit =
    !submitting &&
    decisionContent.trim() &&
    expectedOutcome.trim() &&
    successCriteria.trim() &&
    successReason.trim() &&
    effectivePeriod > 0;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await addPrediction({
        decisionContent: decisionContent.trim(),
        expectedOutcome: expectedOutcome.trim(),
        successCriteria: successCriteria.trim(),
        successReason: successReason.trim(),
        reviewPeriodDays: effectivePeriod,
      });
      router.push(`/predictions/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗，請稍後再試。");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-7">
      <div>
        <label className="block text-[15px] font-semibold text-ink mb-2">決策／行動</label>
        <textarea
          value={decisionContent}
          onChange={(e) => setDecisionContent(e.target.value)}
          placeholder="例如：開始經營個人品牌網站"
          rows={4}
          className={fieldClass + " min-h-[100px]"}
        />
      </div>

      <div>
        <label className="block text-[15px] font-semibold text-ink mb-2">我預期會發生什麼</label>
        <textarea
          value={expectedOutcome}
          onChange={(e) => setExpectedOutcome(e.target.value)}
          placeholder="例如：三個月內每月會有至少 5 個新諮詢案"
          rows={4}
          className={fieldClass + " min-h-[100px]"}
        />
      </div>

      <div>
        <label className="block text-[15px] font-semibold text-ink mb-2">成功判斷標準</label>
        <textarea
          value={successCriteria}
          onChange={(e) => setSuccessCriteria(e.target.value)}
          placeholder="例如：以實際收到的諮詢數量為準，達到 5 件以上即視為成功"
          rows={4}
          className={fieldClass + " min-h-[100px]"}
        />
      </div>

      <div>
        <label className="block text-[15px] font-semibold text-ink mb-2">我為什麼認為會成功</label>
        <textarea
          value={successReason}
          onChange={(e) => setSuccessReason(e.target.value)}
          placeholder="例如：因為我的目標受眾明確，且內容能解決他們的痛點"
          rows={4}
          className={fieldClass + " min-h-[100px]"}
        />
      </div>

      <div>
        <label className="block text-[15px] font-semibold text-ink mb-2">回顧週期</label>
        <div className="flex flex-wrap items-center gap-3">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPeriod(p);
                setCustomDays("");
              }}
              className="min-h-[44px] px-5 rounded-sm border text-[15px] transition-colors"
              style={{
                borderColor: !customDays && period === p ? "#1B2430" : "#D9D7D1",
                backgroundColor: !customDays && period === p ? "#1B2430" : "transparent",
                color: !customDays && period === p ? "#F7F5F0" : "#1B2430",
              }}
            >
              {p} 天
            </button>
          ))}
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-muted">自訂</span>
            <input
              type="number"
              min={1}
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              placeholder="例如：60"
              className="w-24 min-h-[44px] rounded-sm border border-line px-3 text-[15px] text-ink focus:border-ink transition-colors"
            />
            <span className="text-[14px] text-muted">天</span>
          </div>
        </div>

        {previewDate && (
          <div className="mt-4 rounded-sm bg-surface px-4 py-3">
            <p className="text-[13px] text-muted">預計回顧日期</p>
            <p className="mt-1 text-[16px] text-ink">
              {formatDateLong(previewDate)}（{effectivePeriod} 天後）
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-[14px]" style={{ color: "#B85F50" }}>{error}</p>}

      <button
        type="button"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="min-h-[50px] rounded-sm bg-ink text-paper text-[16px] font-medium disabled:opacity-40 transition-colors hover:bg-[#28344a]"
      >
        {submitting ? "建立中…" : "建立這張卡"}
      </button>
    </div>
  );
}
