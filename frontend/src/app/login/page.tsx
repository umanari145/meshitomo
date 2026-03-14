import Link from "next/link";
import Header from "@/components/Header";

export const metadata = {
  title: "ログイン — メシとも",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">ログイン</h1>
              <p className="text-sm text-gray-500 mt-1">
                アカウントにログインしてイベントに参加しよう
              </p>
            </div>

            <form className="space-y-5">
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
                  autoComplete="email"
                  placeholder="example@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
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
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-lg shadow transition"
              >
                ログイン
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
    </>
  );
}
