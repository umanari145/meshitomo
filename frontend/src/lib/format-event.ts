import type {
  Event as PrismaEvent,
  User,
  Participant,
} from "@/generated/prisma/client";

export type EventWithRelations = PrismaEvent & {
  host: User;
  participants: (Participant & { user: User })[];
  _count?: { participants: number };
};

export type EventSummaryView = {
  id: string;
  title: string;
  restaurant: string;
  date: string;
  area: string;
  budget: string;
  currentMembers: number;
  maxMembers: number;
  status: string;
};

export type EventDetailView = EventSummaryView & {
  address: string;
  time: string;
  category: string;
  subCategory: string | null;
  genderFilter: string;
  host: {
    nickname: string;
    ageGroup: string;
    gender: string;
    trustScore: number;
  };
  participants: {
    nickname: string;
    ageGroup: string;
    gender: string;
  }[];
};

const DAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

function formatDate(date: Date): string {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayName = DAY_NAMES[d.getDay()];
  return `${month}/${day}（${dayName}）`;
}

function formatBudget(min: number, max: number): string {
  const fmtMin = min.toLocaleString("ja-JP");
  const fmtMax = max.toLocaleString("ja-JP");
  return `${fmtMin}〜${fmtMax}円`;
}

function mapStatus(status: string): string {
  return status.toLowerCase();
}

export function toEventSummary(
  event: PrismaEvent & { _count?: { participants: number } },
  participantCount?: number,
): EventSummaryView {
  const count = participantCount ?? event._count?.participants ?? 0;
  return {
    id: event.id,
    title: event.title,
    restaurant: event.restaurantName,
    date: formatDate(event.date),
    area: event.area,
    budget: formatBudget(event.budgetMin, event.budgetMax),
    currentMembers: count + 1, // +1 for host
    maxMembers: event.maxMembers,
    status: mapStatus(event.status),
  };
}

export function toEventDetail(event: EventWithRelations): EventDetailView {
  return {
    ...toEventSummary(event, event.participants.length),
    address: event.address,
    time: event.time,
    category: event.category,
    subCategory: event.subCategory,
    genderFilter: event.genderFilter,
    host: {
      nickname: event.host.nickname,
      ageGroup: event.host.ageGroup,
      gender: event.host.gender,
      trustScore: event.host.trustScore,
    },
    participants: event.participants.map((p) => ({
      nickname: p.user.nickname,
      ageGroup: p.user.ageGroup,
      gender: p.user.gender,
    })),
  };
}
