export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="py-20 text-center">
      <p className="font-serif text-[19px] text-ink">{title}</p>
      <p className="mt-3 text-[14px] text-muted">{subtitle}</p>
    </div>
  );
}
