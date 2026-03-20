import Link from "next/link";
import { getSession } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-brand-500 tracking-wide"
        >
          🍻 メシとも
        </Link>

        <div className="flex items-center gap-2">
          {session ? (
            // ── ログイン済み ──
            <>
              <span className="text-sm text-gray-600 px-3 py-2">
                👤 {session.nickname}
              </span>
              <LogoutButton />
            </>
          ) : (
            // ── 未ログイン ──
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-brand-500 px-3 py-2 rounded-lg transition"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="text-sm bg-brand-500 hover:bg-brand-600 text-white font-semibold px-4 py-2 rounded-full transition shadow-sm"
              >
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
