import { PageHeader } from "@/components/PageHeader";

export default function AnalyticsPage() {
  return (
    <div>
      <PageHeader title="分析" subtitle="尚未開放" />
      <p className="text-[15px] text-muted max-w-[480px] leading-relaxed">
        長期累積足夠的檢討紀錄後，這裡會呈現你在不同判斷上的準確度模式。目前先專注於記錄與檢討本身。
      </p>
    </div>
  );
}
