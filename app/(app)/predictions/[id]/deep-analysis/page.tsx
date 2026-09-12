"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePredictionStore } from "@/lib/store";
import { REVIEW_RESULT_COLOR, REVIEW_RESULT_LABEL } from "@/lib/types";

export default function DeepAnalysisPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getPrediction, saveDeepAnalysis, loading } = usePredictionStore();
  const prediction = getPrediction(params.id);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (prediction) setText(prediction.deepAnalysis ?? "");
  }, [prediction?.id]);

  if (loading) return null;

  if (!prediction) {
    return <div className="py-16 text-center text-muted text-[15px]">找不到這張卡片。</div>;
  }

  async function handleSave() {
    if (!prediction) return;
    setSaving(true);
    setError(null);
    try {
      await saveDeepAnalysis(prediction.id, text);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存失敗，請稍後再試。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-content">
      <div className="mb-10">
        <p className="text-[13px] text-muted mb-1">決策內容</p>
        <p className="font-serif text-[19px] text-ink mb-4">{prediction.decisionContent}</p>
        {prediction.quickReviewResult && (
          <p className="text-[15px] font-medium" style={{ color: REVIEW_RESULT_COLOR[prediction.quickReviewResult] }}>
            快速檢討結果：{REVIEW_RESULT_LABEL[prediction.quickReviewResult]}
          </p>
        )}
      </div>

      <p className="font-serif text-[20px] text-ink mb-4">
        這次的判斷，你會怎麼跟自己解釋？
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[320px] rounded-sm border border-line px-5 py-4 text-[16px] text-ink leading-relaxed focus:border-ink transition-colors"
      />

      {error && <p className="mt-3 text-[14px]" style={{ color: "#B85F50" }}>{error}</p>}

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="min-h-[48px] px-6 rounded-sm bg-ink text-paper text-[15px] font-medium hover:bg-[#28344a] transition-colors disabled:opacity-60"
        >
          {saving ? "儲存中…" : "儲存"}
        </button>
        {saved && <span className="text-[14px] text-muted">已儲存</span>}
        <button
          type="button"
          onClick={() => router.push(`/predictions/${prediction.id}`)}
          className="text-[14px] text-muted hover:text-ink transition-colors"
        >
          返回卡片
        </button>
      </div>
    </div>
  );
}
