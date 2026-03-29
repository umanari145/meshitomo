"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ApplyState = "idle" | "loading" | "success" | "error";

type Props = {
  eventId: string;
  isLoggedIn: boolean;
  /** ログイン後に戻すパス（例: /events/xxx） */
  loginRedirectPath: string;
  /** 主催者・応募済みなどで応募不可 */
  blockedReason: "host" | "already" | null;
};

const buttonClass =
  "inline-block w-full md:w-auto bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg px-12 py-4 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition";

export default function EventApplySection({
  eventId,
  isLoggedIn,
  loginRedirectPath,
  blockedReason,
}: Props) {
  const router = useRouter();
  const [state, setState] = useState<ApplyState>("idle");
  const [message, setMessage] = useState("");

  if (blockedReason === "host") {
    return (
      <div className="text-center">
        <p className="text-gray-600 font-medium">
          あなたが主催しているイベントです
        </p>
      </div>
    );
  }

  if (blockedReason === "already") {
    return (
      <div className="text-center">
        <p className="text-green-700 font-medium">応募済みです</p>
        <p className="text-xs text-gray-400 mt-2">当日はよろしくお願いします</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    const loginHref = `/login?redirect=${encodeURIComponent(loginRedirectPath)}`;
    return (
      <div className="text-center">
        <Link href={loginHref} className={buttonClass}>
          このイベントに応募する
        </Link>
        <p className="text-xs text-gray-400 mt-3">応募にはログインが必要です</p>
      </div>
    );
  }

  const handleJoin = async () => {
    setState("loading");
    setMessage("");
    try {
      const res = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "応募に失敗しました");
        return;
      }

      setState("success");
      router.refresh();
    } catch {
      setState("error");
      setMessage("通信エラーが発生しました");
    }
  };

  if (state === "success") {
    return (
      <div className="text-center">
        <p className="text-green-700 font-medium">応募が完了しました</p>
        <p className="text-xs text-gray-400 mt-2">
          主催者・参加者一覧が更新されるまで少し時間がかかる場合があります
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={handleJoin}
        disabled={state === "loading"}
        className={buttonClass}
      >
        {state === "loading" ? "送信中..." : "このイベントに応募する"}
      </button>
      {state === "error" && message && (
        <p className="text-sm text-red-600 mt-3">{message}</p>
      )}
    </div>
  );
}
