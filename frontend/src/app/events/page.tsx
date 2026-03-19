import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import EventFilter from "@/components/EventFilter";
import { prisma } from "@/lib/prisma";
import { toEventSummary } from "@/lib/format-event";

export const dynamic = "force-dynamic";

async function getEvents(
  areas: string[],
  categories: string[],
  statuses: string[]
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};

  // 複数選択時は IN 検索、1件のみなら完全一致と同等
  if (areas.length > 0) where.area = { in: areas };
  if (categories.length > 0) where.category = { in: categories };
  if (statuses.length > 0) where.status = { in: statuses };

  const events = await prisma.event.findMany({
    where,
    include: { _count: { select: { participants: true } } },
    orderBy: { date: "asc" },
  });
  return events.map((e: (typeof events)[number]) => toEventSummary(e));
}

// searchParams は文字列 or 配列で来る場合があるため正規化
function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function EventListPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const areas = toArray(params.area);
  const categories = toArray(params.category);
  const statuses = toArray(params.status);

  const events = await getEvents(areas, categories, statuses);
  const hasFilter =
    areas.length > 0 || categories.length > 0 || statuses.length > 0;

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          {/* パンくずリスト */}
          <nav className="text-sm text-gray-400 mb-6 flex items-center gap-1">
            <Link href="/" className="hover:text-brand-500 transition">
              トップ
            </Link>
            <span>/</span>
            <span className="text-gray-600">イベント一覧</span>
          </nav>

          {/* ページヘッダー */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              イベント一覧
            </h1>
            <p className="text-gray-500 text-sm">
              気になるイベントを見つけて、新しいメシともを作ろう
            </p>
          </div>

          {/* フィルターパネル（Client Component）
              選択中の値を Server Component から props で渡すことで、
              Client Component 内で useSearchParams() を使わずに済む。
              → Suspense が不要になりシンプルな構成になる */}
          <EventFilter
            selectedAreas={areas}
            selectedCategories={categories}
            selectedStatuses={statuses}
          />

          {/* 件数表示 */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">
                {events.length}件
              </span>
              のイベントが見つかりました
            </p>
          </div>

          {/* イベントグリッド */}
          {events.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-20 text-center">
              <p className="text-4xl mb-4">🍽️</p>
              <p className="text-gray-500 font-medium mb-2">
                該当するイベントがありません
              </p>
              <p className="text-sm text-gray-400 mb-6">
                条件を変えて再度検索してみてください
              </p>
              {hasFilter && (
                <Link
                  href="/events"
                  className="text-sm text-brand-500 hover:text-brand-700 font-semibold transition"
                >
                  すべてのイベントを見る →
                </Link>
              )}
            </div>
          )}

          {/* CTAバナー */}
          <div className="mt-12 bg-gradient-to-r from-brand-500 to-amber-500 rounded-2xl p-8 text-white text-center">
            <p className="text-lg font-bold mb-1">メシともを開催しませんか？</p>
            <p className="text-brand-100 text-sm mb-5">
              あなたが主催者になって、仲間を集めよう
            </p>
            <Link
              href="/login"
              className="inline-block bg-white text-brand-600 font-bold px-8 py-3 rounded-full shadow hover:shadow-md hover:-translate-y-0.5 transition"
            >
              ログインしてイベントを作る
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
