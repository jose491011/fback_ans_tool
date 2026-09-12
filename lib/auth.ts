import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

const ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "帳號或密碼錯誤，請再確認一次。",
  "Email not confirmed": "此帳號的電子郵件尚未驗證。",
};

export async function signIn(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) {
    const message = error?.message ? ERROR_MESSAGES[error.message] ?? error.message : undefined;
    throw new Error(message ?? "登入失敗，請確認帳號密碼。");
  }
  return data.session;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
