const steps = [
  {
    icon: "🔍",
    title: "1. イベントを探す",
    description:
      "予算・地域・食べたいものでぴったりのイベントを検索。登録しなくても閲覧できます。",
    bg: "bg-brand-100",
  },
  {
    icon: "✋",
    title: "2. 応募する",
    description:
      "気になるイベントに応募するだけ。面倒なやりとりは一切不要です。",
    bg: "bg-green-100",
  },
  {
    icon: "🍖",
    title: "3. 一緒に食べる",
    description: "当日お店に集合して、完全割り勘で楽しむだけ。シンプルです。",
    bg: "bg-amber-100",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
        メシともの使い方
      </h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {steps.map((step) => (
          <div key={step.title}>
            <div
              className={`w-20 h-20 ${step.bg} rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4`}
            >
              {step.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
