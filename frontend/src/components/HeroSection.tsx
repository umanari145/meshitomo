import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-brand-500 via-brand-600 to-amber-600 text-white">
      <div className="max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
          たまには誰かと、
          <br />
          食べ放題に行こう。
        </h1>
        <p className="text-brand-100 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          予算・食べたいもの・地域でつながる
          <br />
          飲み・食べ放題マッチングサービス
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/events"
            className="bg-white text-brand-600 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
          >
            🔍 イベントを探す
          </Link>
          <Link
            href="/register"
            className="bg-white/15 hover:bg-white/25 text-white font-bold text-lg px-8 py-4 rounded-full border border-white/30 transition"
          >
            無料で始める
          </Link>
        </div>
        <p className="text-brand-200 text-xs mt-4">※ 20歳以上限定・登録無料</p>
      </div>
    </section>
  );
}
