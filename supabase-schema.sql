-- 個人決策回饋分析法工具 — Supabase schema
-- 在 Supabase 專案的 SQL Editor 貼上並執行一次即可。

create extension if not exists pgcrypto;

-- ============================================================
-- 資料表：predictions（預測卡）
-- ============================================================
create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  decision_content text not null,
  expected_outcome text not null,
  success_criteria text not null,
  success_reason text not null,
  review_period_days integer not null check (review_period_days > 0),
  review_due_date date not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  delay_count integer not null default 0,
  quick_review_result text check (quick_review_result in ('better', 'expected', 'worse')),
  quick_review_main_reason text,
  quick_review_next_step text,
  quick_review_completed_at timestamptz,
  deep_analysis text,
  tags text[] not null default '{}'
);

create index if not exists predictions_user_id_idx on public.predictions(user_id);
create index if not exists predictions_review_due_date_idx on public.predictions(review_due_date);

alter table public.predictions enable row level security;

drop policy if exists "predictions_select_own" on public.predictions;
create policy "predictions_select_own" on public.predictions
  for select using (auth.uid() = user_id);

drop policy if exists "predictions_insert_own" on public.predictions;
create policy "predictions_insert_own" on public.predictions
  for insert with check (auth.uid() = user_id);

drop policy if exists "predictions_update_own" on public.predictions;
create policy "predictions_update_own" on public.predictions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "predictions_delete_own" on public.predictions;
create policy "predictions_delete_own" on public.predictions
  for delete using (auth.uid() = user_id);

-- ============================================================
-- 資料表：delay_logs（延後歷史，完整記錄每一次延後）
-- ============================================================
create table if not exists public.delay_logs (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null references public.predictions(id) on delete cascade,
  delay_reason text not null check (
    delay_reason in (
      'no_result_yet',
      'too_busy',
      'project_delayed',
      'avoiding',
      'goal_miscalibrated',
      'external_change',
      'other'
    )
  ),
  old_due_date date not null,
  new_due_date date not null,
  delayed_at timestamptz not null default now()
);

create index if not exists delay_logs_prediction_id_idx on public.delay_logs(prediction_id);

alter table public.delay_logs enable row level security;

drop policy if exists "delay_logs_select_own" on public.delay_logs;
create policy "delay_logs_select_own" on public.delay_logs
  for select using (
    exists (
      select 1 from public.predictions p
      where p.id = delay_logs.prediction_id and p.user_id = auth.uid()
    )
  );

drop policy if exists "delay_logs_insert_own" on public.delay_logs;
create policy "delay_logs_insert_own" on public.delay_logs
  for insert with check (
    exists (
      select 1 from public.predictions p
      where p.id = delay_logs.prediction_id and p.user_id = auth.uid()
    )
  );

-- ============================================================
-- RPC：delay_prediction — 延後檢討的原子操作
-- 同時寫入 delay_logs 並更新 predictions（新檢討日期、延後次數 +1）
-- ============================================================
create or replace function public.delay_prediction(
  p_prediction_id uuid,
  p_reason text,
  p_new_due_date date
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_due_date date;
  v_owner uuid;
begin
  select review_due_date, user_id into v_old_due_date, v_owner
  from public.predictions
  where id = p_prediction_id;

  if v_owner is null or v_owner <> auth.uid() then
    raise exception 'not found or not permitted';
  end if;

  insert into public.delay_logs (prediction_id, delay_reason, old_due_date, new_due_date)
  values (p_prediction_id, p_reason, v_old_due_date, p_new_due_date);

  update public.predictions
  set review_due_date = p_new_due_date,
      delay_count = delay_count + 1
  where id = p_prediction_id;
end;
$$;
