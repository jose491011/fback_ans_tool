export function SectionLabel({ children }: { children: string }) {
  return (
    <div className="mb-2">
      <span className="text-[14px] font-semibold text-ink">{children}</span>
      <div className="mt-2 border-b border-line" />
    </div>
  );
}
