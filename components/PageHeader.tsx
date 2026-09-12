import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif text-[30px] md:text-[40px] font-semibold text-ink leading-tight">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-[15px] md:text-[16px] text-muted">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 pt-1">{action}</div>}
    </div>
  );
}
