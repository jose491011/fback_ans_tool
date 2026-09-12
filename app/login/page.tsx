"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth";
import { VERSION_TAG } from "@/lib/version";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    if (!email.trim() || !password) {
      setError("請輸入電子郵件與密碼。");
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入失敗，請稍後再試。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="relative md:w-[40%] bg-ink text-paper px-8 py-12 md:px-14 md:py-16 flex flex-col justify-between overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #F7F5F0 0px, #F7F5F0 1px, transparent 1px, transparent 28px)",
          }}
        />
        <div className="relative">
          <div className="font-serif text-[15px] tracking-wide opacity-80">PDA</div>
          <div className="mt-1 h-px w-8 bg-paper/30" />
        </div>

        <div className="relative">
          <h1 className="font-serif text-[32px] md:text-[42px] font-semibold leading-tight">
            個人決策
            <br />
            回饋分析法工具
          </h1>
          <p className="mt-4 text-[16px] md:text-[17px] opacity-80 leading-relaxed">
            記錄你的判斷，
            <br />
            回頭看看自己說對了什麼
          </p>
        </div>

        <div className="relative text-[13px] opacity-60 leading-relaxed">
          持續記錄，
          <br />
          持續成為更了解自己的人。
        </div>
      </div>

      <div className="flex-1 bg-paper flex items-center justify-center px-6 py-14 md:px-16">
        <div className="w-full max-w-sm">
          <h2 className="font-serif text-[22px] md:text-[26px] font-semibold text-ink mb-8">
            登入你的帳號
          </h2>

          <div className="mb-5">
            <label className="block text-[15px] font-semibold text-ink mb-2">電子郵件</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@yourdomain.com"
              className="w-full min-h-[48px] rounded-sm border border-line px-4 text-[15px] text-ink focus:border-ink transition-colors"
            />
          </div>

          <div className="mb-8">
            <label className="block text-[15px] font-semibold text-ink mb-2">密碼</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                className="w-full min-h-[48px] rounded-sm border border-line pl-4 pr-11 text-[15px] text-ink focus:border-ink transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="mb-4 text-[14px]" style={{ color: "#B85F50" }}>{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full min-h-[50px] rounded-sm bg-ink text-paper text-[16px] font-medium transition-colors hover:bg-[#28344a] disabled:opacity-60"
          >
            {loading ? "登入中…" : "登入"}
          </button>

          <p className="mt-8 text-center text-[13px] text-muted leading-relaxed">
            —<br />
            持續記錄，持續成為更好的自己。
          </p>
          <p className="mt-3 text-center text-[12px] text-muted">{VERSION_TAG}</p>
        </div>
      </div>
    </div>
  );
}
