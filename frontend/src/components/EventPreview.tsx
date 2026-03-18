import Link from "next/link";
import EventCard from "./EventCard";
import { prisma } from "@/lib/prisma";
import { toEventSummary, type EventSummaryView } from "@/lib/format-event";

async function getRecruitingEvents(): Promise<EventSummaryView[]> {
  const events = await prisma.event.findMany({
    where: { status: "RECRUITING" },
    include: { _count: { select: { participants: true } } },
    orderBy: { date: "asc" },
    take: 3,
  });
  return events.map((e: (typeof events)[number]) => toEventSummary(e));
}

export default async function EventPreview() {
  const events = await getRecruitingEvents();

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
          {events.map((event) => (
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
