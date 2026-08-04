import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://evlyzdvmitymlemippsq.supabase.co";
const SUPABASE_KEY = "sb_publishable_ICaaAuZwF7td8KpWKojulA_3w1nKYQA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

export const PUBLIC_SURVEYS_TABLE = "public_surveys";

// 初始化数据库的 SQL（需要在 Supabase SQL Editor 执行一次）
// 为方便手机复制，已拆成 3 条短语句：
//
// -- 1. 建表
// create table public_surveys (id uuid default gen_random_uuid() primary key,title text not null,questions jsonb not null,author text not null,status text not null default 'pending',created_at timestamptz default now(),approved_at timestamptz);
//
// -- 2. 开启 RLS
// alter table public_surveys enable row level security;
//
// -- 3. 策略
// create policy "read_approved" on public_surveys for select using (status = 'approved');
// create policy "submit_pending" on public_surveys for insert with check (status = 'pending');
// create policy "update_any" on public_surveys for update using (true);
// create policy "delete_any" on public_surveys for delete using (true);
