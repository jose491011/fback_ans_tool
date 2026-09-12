export type ReviewResult = "better" | "expected" | "worse";

export const REVIEW_RESULT_LABEL: Record<ReviewResult, string> = {
  better: "比預期好",
  expected: "符合預期",
  worse: "比預期差",
};

export const REVIEW_RESULT_COLOR: Record<ReviewResult, string> = {
  better: "#4A6B5A",
  expected: "#6B7A8F",
  worse: "#A65D4E",
};

export type DelayReason =
  | "no_result_yet"
  | "too_busy"
  | "project_delayed"
  | "avoiding"
  | "goal_miscalibrated"
  | "external_change"
  | "other";

export const DELAY_REASON_LABEL: Record<DelayReason, string> = {
  no_result_yet: "尚未有結果",
  too_busy: "目前太忙",
  project_delayed: "專案延期",
  avoiding: "不想面對結果",
  goal_miscalibrated: "預期目標設定過高或過低",
  external_change: "外部環境重大改變",
  other: "其他",
};

export type PredictionStatus = "pending" | "reviewed";

export interface Prediction {
  id: string;
  createdAt: string;
  decisionContent: string;
  expectedOutcome: string;
  successCriteria: string;
  successReason: string;
  reviewPeriodDays: number;
  reviewDueDate: string;
  status: PredictionStatus;
  delayCount: number;
  quickReviewResult?: ReviewResult;
  quickReviewMainReason?: string;
  quickReviewNextStep?: string;
  quickReviewCompletedAt?: string;
  deepAnalysis?: string;
}

export interface NewPredictionInput {
  decisionContent: string;
  expectedOutcome: string;
  successCriteria: string;
  successReason: string;
  reviewPeriodDays: number;
}
