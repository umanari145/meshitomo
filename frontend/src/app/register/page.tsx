"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import type { RegisterResponse } from "@/app/api/auth/register/route";

const AGE_GROUPS = ["20代", "30代", "40代", "50代以上"];
const GENDERS = ["男性", "女性", "その他"];
const FOOD_PREFERENCES = ["ガッツリ系", "軽め", "とにかく飲む"];

// 年代から仮の生年月日を生成（YYYY-01-01 形式）
const AGE_GROUP_BIRTH_YEAR: Record<string, number> = {
  "20代": 2000,
  "30代": 1990,
  "40代": 1980,
  "50代以上": 1970,
};

type Step = 1 | 2;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // ── Step1: アカウント情報 ──
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // ── Step2: プロフィール情報 ──
  const [nickname, setNickname] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [gender, setGender] = useState("");
  const [foodPreference, setFoodPreference] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailInvalid = email !== "" && !emailRegex.test(email);

  const passwordMismatch =
    passwordConfirm !== "" && password !== passwordConfirm;

  const canProceed =
    email !== "" && !emailInvalid && password.length >= 8 && !passwordMismatch;

  const canSubmit =
    nickname !== "" &&
    ageGroup !== "" &&
    gender !== "" &&
    foodPreference !== "";

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceed) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setApiError("");

    try {
      const birthYear = AGE_GROUP_BIRTH_YEAR[ageGroup] ?? 1990;
      const birthDate = `${birthYear}-01-01`;

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nickname,
          ageGroup,
          gender,
          foodPreference,
          birthDate,
        }),
      });

      const data = (await res.json()) as RegisterResponse;

      if (!data.ok) {
        setApiError(data.error);
        return;
      }

      // 登録成功 → トップページへリダイレクト（認証実装後はログイン済みページへ）
      router.push("/?registered=true");
    } catch {
      setApiError(
        "通信エラーが発生しました。しばらく経ってから再試行してください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-gray-50 px-4 py-10">
        <div className="w-full max-w-md">
          {/* ステッパー */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <StepBadge num={1} current={step} label="アカウント" />
            <div className="flex-1 max-w-12 h-px bg-gray-200" />
            <StepBadge num={2} current={step} label="プロフィール" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* ── Step 1: アカウント情報 ── */}
            {step === 1 && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-800">
                    アカウント作成
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    まずはメールアドレスとパスワードを設定してください
                  </p>
                </div>

                <form onSubmit={handleStep1} className="space-y-5">
                  <FormField label="メールアドレス">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="example@email.com"
                      required
                      className={`${inputClass} ${
                        emailInvalid ? "border-red-400 focus:ring-red-400" : ""
                      }`}
                    />
                    {emailInvalid && (
                      <p className="text-xs text-red-500 mt-1">
                        メールアドレスの形式が正しくありません
                      </p>
                    )}
                  </FormField>

                  <FormField label="パスワード" hint="8文字以上">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      required
                      className={inputClass}
                    />
                    {password.length > 0 && password.length < 8 && (
                      <p className="text-xs text-red-500 mt-1">
                        8文字以上で入力してください
                      </p>
                    )}
                  </FormField>

                  <FormField label="パスワード（確認）">
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      required
                      className={`${inputClass} ${
                        passwordMismatch
                          ? "border-red-400 focus:ring-red-400"
                          : ""
                      }`}
                    />
                    {passwordMismatch && (
                      <p className="text-xs text-red-500 mt-1">
                        パスワードが一致しません
                      </p>
                    )}
                  </FormField>

                  <button
                    type="submit"
                    disabled={!canProceed}
                    className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-lg shadow transition"
                  >
                    次へ進む →
                  </button>
                </form>
              </>
            )}

            {/* ── Step 2: プロフィール情報 ── */}
            {step === 2 && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-800">
                    プロフィール設定
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    マッチングに使う情報を設定します（匿名でOK）
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormField
                    label="ニックネーム"
                    hint="他のユーザーに表示される名前です"
                  >
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="例: たけし"
                      required
                      maxLength={20}
                      className={inputClass}
                    />
                  </FormField>

                  <FormField label="年代">
                    <div className="flex flex-wrap gap-2">
                      {AGE_GROUPS.map((age) => (
                        <SelectChip
                          key={age}
                          label={age}
                          selected={ageGroup === age}
                          onClick={() => setAgeGroup(age)}
                        />
                      ))}
                    </div>
                  </FormField>

                  <FormField label="性別">
                    <div className="flex flex-wrap gap-2">
                      {GENDERS.map((g) => (
                        <SelectChip
                          key={g}
                          label={g}
                          selected={gender === g}
                          onClick={() => setGender(g)}
                        />
                      ))}
                    </div>
                  </FormField>

                  <FormField
                    label="食の傾向"
                    hint="どんなスタイルで飲み食いするのが好きですか？"
                  >
                    <div className="flex flex-wrap gap-2">
                      {FOOD_PREFERENCES.map((f) => (
                        <SelectChip
                          key={f}
                          label={f}
                          selected={foodPreference === f}
                          onClick={() => setFoodPreference(f)}
                        />
                      ))}
                    </div>
                  </FormField>

                  {/* APIエラーメッセージ */}
                  {apiError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                      {apiError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setApiError("");
                      }}
                      disabled={isLoading}
                      className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 font-semibold py-3 rounded-lg transition"
                    >
                      ← 戻る
                    </button>
                    <button
                      type="submit"
                      disabled={!canSubmit || isLoading}
                      className="flex-[2] bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3 rounded-lg shadow transition flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          登録中...
                        </>
                      ) : (
                        "登録する"
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ログインへのリンク */}
            <p className="text-center text-sm text-gray-500 mt-6">
              すでにアカウントをお持ちの方は{" "}
              <Link
                href="/login"
                className="text-brand-500 font-medium hover:text-brand-700 transition"
              >
                ログイン
              </Link>
            </p>
          </div>

          {/* 利用規約の同意文 */}
          <p className="text-center text-xs text-gray-400 mt-4">
            登録することで
            <Link
              href="/terms"
              className="underline hover:text-gray-600 transition mx-0.5"
            >
              利用規約
            </Link>
            および
            <Link
              href="/privacy"
              className="underline hover:text-gray-600 transition mx-0.5"
            >
              プライバシーポリシー
            </Link>
            に同意したものとみなします
          </p>
        </div>
      </main>
    </>
  );
}

// ── サブコンポーネント ─────────────────────────────────────────────────

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition";

function FormField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {hint && <span className="text-xs text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function SelectChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm px-4 py-2 rounded-full border font-medium transition ${
        selected
          ? "bg-brand-500 border-brand-500 text-white shadow-sm"
          : "bg-white border-gray-300 text-gray-600 hover:border-brand-400 hover:text-brand-600"
      }`}
    >
      {label}
    </button>
  );
}

function StepBadge({
  num,
  current,
  label,
}: {
  num: number;
  current: Step;
  label: string;
}) {
  const done = num < current;
  const active = num === current;
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
          done
            ? "bg-brand-500 text-white"
            : active
            ? "bg-brand-500 text-white ring-4 ring-brand-100"
            : "bg-gray-200 text-gray-400"
        }`}
      >
        {done ? "✓" : num}
      </div>
      <span
        className={`text-xs ${
          active ? "text-brand-600 font-semibold" : "text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
