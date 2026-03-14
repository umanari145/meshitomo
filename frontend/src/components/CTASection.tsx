import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-gradient-to-r from-brand-500 to-amber-500 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          今日のメシ仲間を見つけよう
        </h2>
        <p className="text-brand-100 mb-8">
          登録は無料。1分で完了します。
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-brand-600 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
        >
          無料で始める
        </Link>
      </div>
    </section>
  );
}
