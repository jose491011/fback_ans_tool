import { PageHeader } from "@/components/PageHeader";
import { PredictionForm } from "@/components/PredictionForm";

export default function NewPredictionPage() {
  return (
    <div>
      <PageHeader title="新增預測" subtitle="寫下你的判斷，設定回顧時間，未來再回來看看。" />
      <PredictionForm />
    </div>
  );
}
