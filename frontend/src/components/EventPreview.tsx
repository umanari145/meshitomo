import Link from "next/link";
import EventCard, { type Event } from "./EventCard";

const sampleEvents: Event[] = [
  {
    id: "1",
    title: "🔥 焼肉食べ放題いきませんか！",
    restaurant: "焼肉きんぐ 新宿西口店",
    date: "3/20（木）",
    area: "新宿",
    budget: "3,000〜4,000円",
    currentMembers: 2,
    maxMembers: 4,
    status: "recruiting",
  },
  {
    id: "2",
    title: "🍣 回転寿司で飲みましょう",
    restaurant: "スシロー 渋谷駅前店",
    date: "3/22（土）",
    area: "渋谷",
    budget: "2,000〜3,000円",
    currentMembers: 1,
    maxMembers: 3,
    status: "recruiting",
  },
  {
    id: "3",
    title: "🍲 火鍋でわいわい飲みたい",
    restaurant: "海底撈火鍋 池袋店",
    date: "3/25（火）",
    area: "池袋",
    budget: "4,000〜5,000円",
    currentMembers: 4,
    maxMembers: 5,
    status: "last-spot",
  },
];

export default function EventPreview() {
  return (
    <section className="bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          開催予定のイベント
        </h2>
        <p className="text-gray-500 text-center mb-10">
          登録しなくてもイベントを閲覧できます
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          {sampleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/events"
            className="text-brand-500 hover:text-brand-700 font-semibold text-sm transition"
          >
            すべてのイベントを見る →
          </Link>
        </div>
      </div>
    </section>
  );
}
