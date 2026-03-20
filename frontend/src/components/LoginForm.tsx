"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(
        "通信エラーが発生しました。しばらく経ってから再試行してください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">ログイン</h1>
            <p className="text-sm text-gray-500 mt-1">
              アカウントにログインしてイベントに参加しよう
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="example@email.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
                className={inputClass}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-lg shadow transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ログイン中...
                </>
              ) : (
                "ログイン"
              )}
            </button>
          </form>

          <div className="text-center mt-6 space-y-3">
            <Link
              href="/reset-password"
              className="block text-sm text-brand-500 hover:text-brand-700 transition"
            >
              パスワードを忘れた方
            </Link>
            <p className="text-sm text-gray-500">
              アカウントをお持ちでない方は{" "}
              <Link
                href="/register"
                className="text-brand-500 font-medium hover:text-brand-700 transition"
              >
                新規登録
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
