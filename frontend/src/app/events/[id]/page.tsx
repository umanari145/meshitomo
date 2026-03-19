import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { toEventDetail } from "@/lib/format-event";

export const dynamic = "force-dynamic";

const statusConfig: Record<string, { label: string; className: string }> = {
  recruiting: { label: "募集中", className: "bg-green-100 text-green-700" },
  confirmed: { label: "確定", className: "bg-blue-100 text-blue-700" },
  completed: { label: "開催済み", className: "bg-gray-100 text-gray-500" },
  cancelled: { label: "キャンセル", className: "bg-red-100 text-red-500" },
};

const genderFilterLabel: Record<string, string> = {
  anyone: "男女どちらでも",
  same: "同性のみ",
  male: "男性のみ",
  female: "女性のみ",
};

async function getEvent(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      host: true,
      participants: { include: { user: true } },
    },
  });
  return event ? toEventDetail(event) : null;
}

// この関数が受け取るオブジェクトの型は { params: Promise<{ id: string }> } です」という宣言
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) notFound();

  const status = statusConfig[event.status] ?? statusConfig.recruiting;
  const isRecruiting = event.status === "recruiting";
  const spotsLeft = event.maxMembers - event.currentMembers;
  const isLastSpot = isRecruiting && spotsLeft === 1;
  const isFull = spotsLeft <= 0;

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          {/* パンくずリスト */}
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1">
            <Link href="/" className="hover:text-brand-500 transition">
              トップ
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:text-brand-500 transition">
              イベント一覧
            </Link>
            <span>/</span>
            <span className="text-gray-600 truncate">{event.title}</span>
          </nav>

          {/* メインカード */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* ヘッダー部分 */}
            <div className="bg-gradient-to-r from-brand-500 to-amber-500 px-6 py-8 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur`}
                >
                  {status.label}
                </span>
                {isLastSpot && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900">
                    残り1枠
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {event.title}
              </h1>
              <p className="text-brand-100 text-sm">{event.restaurant}</p>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* 基本情報バッジ */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  📅 {event.date}　{event.time}
                </span>
                <span className="bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  📍 {event.area}
                </span>
                <span className="bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  💰 {event.budget}
                </span>
                <span className="bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  🍽️ {event.category}
                  {event.subCategory ? `・${event.subCategory}` : ""}
                </span>
                <span className="bg-brand-50 text-brand-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  👥{" "}
                  {genderFilterLabel[event.genderFilter] ?? event.genderFilter}
                </span>
              </div>

              {/* 詳細情報 */}
              <div className="border border-gray-100 rounded-xl divide-y divide-gray-100">
                <InfoRow label="お店" value={event.restaurant} />
                <InfoRow label="住所" value={event.address} />
                <InfoRow
                  label="日時"
                  value={`${event.date}　${event.time}〜`}
                />
                <InfoRow label="予算" value={event.budget} />
                <InfoRow
                  label="募集人数"
                  value={
                    <span className="flex items-center gap-2">
                      <span className="font-semibold">
                        {event.currentMembers} / {event.maxMembers}人
                      </span>
                      {isRecruiting && !isFull && (
                        <span className="text-green-600 text-xs font-bold">
                          あと{spotsLeft}枠
                        </span>
                      )}
                      {isFull && (
                        <span className="text-gray-400 text-xs">満員</span>
                      )}
                    </span>
                  }
                />
                <InfoRow
                  label="参加条件"
                  value={
                    genderFilterLabel[event.genderFilter] ?? event.genderFilter
                  }
                />
              </div>

              {/* 参加人数バー */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>参加状況</span>
                  <span>
                    {event.currentMembers}/{event.maxMembers}人
                  </span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full transition-all"
                    style={{
                      width: `${
                        (event.currentMembers / event.maxMembers) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* ホスト情報 */}
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  主催者
                </h2>
                <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-xl flex-shrink-0">
                    🧑
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800">
                      {event.host.nickname}
                    </p>
                    <p className="text-sm text-gray-500">
                      {event.host.ageGroup}・{event.host.gender}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400 mb-0.5">信頼スコア</p>
                    <p className="text-lg font-bold text-brand-500">
                      ⭐ {event.host.trustScore.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 参加者一覧 */}
              {event.participants.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    参加者（{event.participants.length}人）
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {event.participants.map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <span className="text-base">🧑</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {p.nickname}
                          </p>
                          <p className="text-xs text-gray-400">
                            {p.ageGroup}・{p.gender}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 応募ボタンエリア */}
              <div className="border-t border-gray-100 pt-6">
                {isRecruiting && !isFull ? (
                  <div className="text-center">
                    <Link
                      href="/login"
                      className="inline-block w-full md:w-auto bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg px-12 py-4 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition"
                    >
                      このイベントに応募する
                    </Link>
                    <p className="text-xs text-gray-400 mt-3">
                      応募にはログインが必要です
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-gray-400 font-medium">
                      {isFull
                        ? "このイベントは満員です"
                        : "このイベントは募集を締め切りました"}
                    </p>
                    <Link
                      href="/events"
                      className="inline-block mt-4 text-brand-500 hover:text-brand-700 font-semibold text-sm transition"
                    >
                      他のイベントを探す →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 戻るリンク */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-brand-500 transition"
            >
              ← トップページに戻る
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 px-4 py-3">
      <span className="text-sm text-gray-400 w-20 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-700 font-medium flex-1">{value}</span>
    </div>
  );
}
