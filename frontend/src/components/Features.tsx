const features = [
  {
    icon: "💰",
    title: "完全割り勘",
    description: "支払いは現地で各自。アプリは決済に関与しないので安心です。",
  },
  {
    icon: "👤",
    title: "匿名制",
    description: "ニックネームだけで参加OK。写真も自己紹介も不要です。",
  },
  {
    icon: "⭐",
    title: "信頼スコア",
    description:
      "ドタキャンするとスコアが下がる仕組みで、安心な参加者が集まります。",
  },
  {
    icon: "🔒",
    title: "通報・ブロック",
    description:
      "迷惑ユーザーは通報・ブロック可能。一定回数で自動利用停止になります。",
  },
];

export default function Features() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
        安心して使える理由
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex gap-4 items-start bg-gray-50 rounded-xl p-5"
          >
            <span className="text-3xl shrink-0">{feature.icon}</span>
            <div>
              <h3 className="font-bold mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
