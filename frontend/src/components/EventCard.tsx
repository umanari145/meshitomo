import Link from "next/link";
import type { EventSummary } from "@/types/event";

const statusConfig: Record<string, { label: string; className: string }> = {
  recruiting: {
    label: "募集中",
    className: "bg-green-100 text-green-700",
  },
  confirmed: {
    label: "確定",
    className: "bg-gray-200 text-gray-600",
  },
  completed: {
    label: "開催済み",
    className: "bg-gray-100 text-gray-500",
  },
};

export default function EventCard({ event }: { event: EventSummary }) {
  const status = statusConfig[event.status] ?? statusConfig.recruiting;
  const isLastSpot =
    event.status === "recruiting" &&
    event.maxMembers - event.currentMembers === 1;

  return (
    <Link
      href={`/events/${event.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        {isLastSpot ? (
          <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">
            残り1枠
          </span>
        ) : (
          <span
            className={`${status.className} text-xs font-bold px-2.5 py-1 rounded-full`}
          >
            {status.label}
          </span>
        )}
        <span className="text-xs text-gray-400">{event.date}</span>
      </div>
      <h3 className="font-bold text-gray-800 mb-1">{event.title}</h3>
      <p className="text-sm text-gray-500 mb-4">{event.restaurant}</p>
      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded">
          📍 {event.area}
        </span>
        <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded">
          💰 {event.budget}
        </span>
        <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded">
          👥 {event.currentMembers}/{event.maxMembers}人
        </span>
      </div>
    </Link>
  );
}
