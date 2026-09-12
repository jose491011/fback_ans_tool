"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { addDaysISO, todayISO } from "@/lib/date";
import type {
  DelayReason,
  NewPredictionInput,
  Prediction,
  ReviewResult,
} from "@/lib/types";

const DAILY_LIMIT = 3;

interface PredictionRow {
  id: string;
  created_at: string;
  decision_content: string;
  expected_outcome: string;
  success_criteria: string;
  success_reason: string;
  review_period_days: number;
  review_due_date: string;
  status: "pending" | "reviewed";
  delay_count: number;
  quick_review_result: ReviewResult | null;
  quick_review_main_reason: string | null;
  quick_review_next_step: string | null;
  quick_review_completed_at: string | null;
  deep_analysis: string | null;
}

function mapRow(row: PredictionRow): Prediction {
  return {
    id: row.id,
    createdAt: row.created_at,
    decisionContent: row.decision_content,
    expectedOutcome: row.expected_outcome,
    successCriteria: row.success_criteria,
    successReason: row.success_reason,
    reviewPeriodDays: row.review_period_days,
    reviewDueDate: row.review_due_date,
    status: row.status,
    delayCount: row.delay_count,
    quickReviewResult: row.quick_review_result ?? undefined,
    quickReviewMainReason: row.quick_review_main_reason ?? undefined,
    quickReviewNextStep: row.quick_review_next_step ?? undefined,
    quickReviewCompletedAt: row.quick_review_completed_at ?? undefined,
    deepAnalysis: row.deep_analysis ?? undefined,
  };
}

interface StoreValue {
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
  getPrediction: (id: string) => Prediction | undefined;
  refresh: () => Promise<void>;
  addPrediction: (input: NewPredictionInput) => Promise<Prediction>;
  delayPrediction: (id: string, reason: DelayReason, newDueDate: string) => Promise<void>;
  submitQuickReview: (
    id: string,
    result: ReviewResult,
    mainReason: string,
    nextStep: string
  ) => Promise<void>;
  saveDeepAnalysis: (id: string, text: string) => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

export function PredictionStoreProvider({ children }: { children: ReactNode }) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await supabase
      .from("predictions")
      .select("*")
      .order("review_due_date", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      return;
    }
    setPredictions(((data ?? []) as PredictionRow[]).map(mapRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<StoreValue>(
    () => ({
      predictions,
      loading,
      error,
      getPrediction: (id) => predictions.find((p) => p.id === id),
      refresh,
      addPrediction: async (input) => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("尚未登入");

        const { count } = await supabase
          .from("predictions")
          .select("id", { count: "exact", head: true })
          .gte("created_at", `${todayISO()}T00:00:00`)
          .lt("created_at", `${addDaysISO(todayISO(), 1)}T00:00:00`);

        if ((count ?? 0) >= DAILY_LIMIT) {
          throw new Error(`每天最多建立 ${DAILY_LIMIT} 張預測卡，明天再回來寫下一個判斷。`);
        }

        const reviewDueDate = addDaysISO(todayISO(), input.reviewPeriodDays);
        const { data, error: insertError } = await supabase
          .from("predictions")
          .insert({
            user_id: user.id,
            decision_content: input.decisionContent,
            expected_outcome: input.expectedOutcome,
            success_criteria: input.successCriteria,
            success_reason: input.successReason,
            review_period_days: input.reviewPeriodDays,
            review_due_date: reviewDueDate,
          })
          .select("*")
          .single();

        if (insertError || !data) {
          throw new Error(insertError?.message ?? "建立失敗，請稍後再試。");
        }

        const created = mapRow(data as PredictionRow);
        setPredictions((prev) => [created, ...prev]);
        return created;
      },
      delayPrediction: async (id, reason, newDueDate) => {
        const { error: rpcError } = await supabase.rpc("delay_prediction", {
          p_prediction_id: id,
          p_reason: reason,
          p_new_due_date: newDueDate,
        });
        if (rpcError) throw new Error(rpcError.message);
        await refresh();
      },
      submitQuickReview: async (id, result, mainReason, nextStep) => {
        const { error: updateError } = await supabase
          .from("predictions")
          .update({
            status: "reviewed",
            quick_review_result: result,
            quick_review_main_reason: mainReason,
            quick_review_next_step: nextStep,
            quick_review_completed_at: new Date().toISOString(),
          })
          .eq("id", id);
        if (updateError) throw new Error(updateError.message);
        await refresh();
      },
      saveDeepAnalysis: async (id, text) => {
        const { error: updateError } = await supabase
          .from("predictions")
          .update({ deep_analysis: text })
          .eq("id", id);
        if (updateError) throw new Error(updateError.message);
        await refresh();
      },
    }),
    [predictions, loading, error, refresh]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function usePredictionStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("usePredictionStore must be used within PredictionStoreProvider");
  return ctx;
}
