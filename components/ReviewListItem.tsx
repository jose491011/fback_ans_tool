import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { daysFromToday, formatDateSlash } from "@/lib/date";
import type { Prediction } from "@/lib/types";

export function ReviewListItem({ prediction }: { prediction: Prediction }) {
  const overdueDays = daysFromToday(prediction.reviewDueDate);
  const overdue = overdueDays > 0;
  const barColor = overdue ? "#B85F50" : "#1B2430";

  return (
    <Link
      href={`/predictions/${prediction.id}`}
      className="flex items-stretch gap-4 py-5 border-b border-line group"
    >
      <div className="w-[3px] rounded-full flex-shrink-0" style={{ backgroundColor: barColor }} />
      <div className="flex-1 min-w-0">
        <p className="font-serif text-[17px] text-ink leading-snug">
          {prediction.decisionContent}
        </p>
        <p className="mt-1.5 text-[14px] text-muted truncate">{prediction.expectedOutcome}</p>
      </div>
      <div className="flex flex-col items-end justify-center flex-shrink-0 gap-1 pl-2 min-w-[110px] text-right">
        <span className="text-[13px] text-muted">{formatDateSlash(prediction.reviewDueDate)}</span>
        {overdue && (
          <span className="text-[13px]" style={{ color: "#B85F50" }}>
            已逾期 {overdueDays} 天
          </span>
        )}
      </div>
      <div className="flex items-center text-line group-hover:text-muted transition-colors">
        <ChevronRight size={18} />
      </div>
    </Link>
  );
}
