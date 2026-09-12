# 個人決策回饋分析法工具

個人決策複盤工具，靈感來自彼得．杜拉克的 Feedback Analysis：在做出重大決策時記錄預測，經過一段時間後回頭對照實際結果。

## 技術棧

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Supabase (Auth + Postgres)

## 開發

```bash
npm install
npm run dev
```

需要 `.env.local`（參考 `.env.local.example`）：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

首次設定 Supabase 專案時，到 SQL Editor 執行 [`supabase-schema.sql`](./supabase-schema.sql) 建立資料表、RLS 政策與 `delay_prediction` RPC。這是單人使用的工具，帳號透過 Supabase Dashboard 的 Authentication → Users 手動建立，沒有公開註冊流程。
