import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDateSlash } from "@/lib/date";
import { REVIEW_RESULT_COLOR, REVIEW_RESULT_LABEL, type Prediction } from "@/lib/types";

function statusLabel(p: Prediction): string {
  if (p.status === "reviewed") return "已檢討";
  if (p.delayCount > 0) return `延後 ${p.delayCount} 次`;
  return "待檢討";
}

export function HistoryListItem({ prediction }: { prediction: Prediction }) {
  return (
    <Link
      href={`/predictions/${prediction.id}`}
      className="flex items-stretch gap-4 py-5 border-b border-line group"
    >
      <div className="w-[3px] rounded-full flex-shrink-0 bg-line" />
      <div className="flex-1 min-w-0">
        <p className="font-serif text-[17px] text-ink leading-snug">
          {prediction.decisionContent}
        </p>
        <p className="mt-1.5 text-[13px] text-muted">
          建卡於 {formatDateSlash(prediction.createdAt.slice(0, 10))}
        </p>
      </div>
      <div className="flex flex-col items-end justify-center flex-shrink-0 gap-1 pl-2 min-w-[130px] text-right">
        <span className="text-[13px] text-muted">{statusLabel(prediction)}</span>
        {prediction.quickReviewResult && (
          <span
            className="text-[13px] font-medium"
            style={{ color: REVIEW_RESULT_COLOR[prediction.quickReviewResult] }}
          >
            {REVIEW_RESULT_LABEL[prediction.quickReviewResult]}
          </span>
        )}
      </div>
      <div className="flex items-center text-line group-hover:text-muted transition-colors">
        <ChevronRight size={18} />
      </div>
    </Link>
  );
}
