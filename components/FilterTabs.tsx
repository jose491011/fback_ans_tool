export interface FilterTabOption {
  key: string;
  label: string;
  count?: number;
}

export function FilterTabs({
  options,
  active,
  onChange,
}: {
  options: FilterTabOption[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex items-center gap-6 border-b border-line">
      {options.map((opt) => {
        const isActive = opt.key === active;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`relative pb-3 text-[14px] transition-colors ${
              isActive ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {opt.label}
            {typeof opt.count === "number" && (
              <span className="ml-1 text-[13px]">({opt.count})</span>
            )}
            {isActive && (
              <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-ink" />
            )}
          </button>
        );
      })}
    </div>
  );
}
