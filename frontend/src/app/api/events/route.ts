import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { toEventSummary } from "@/lib/format-event";

/**
 * GET /api/events
 *
 * クエリパラメータ:
 *   area     - エリアで絞り込み（例: 新宿）
 *   category - カテゴリで絞り込み（例: 焼肉）
 *   status   - ステータスで絞り込み（RECRUITING / CONFIRMED / COMPLETED）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const area = searchParams.get("area");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {};
  if (area) where.area = area;
  if (category) where.category = category;
  if (status) where.status = status.toUpperCase();

  const events = await prisma.event.findMany({
    where,
    include: { _count: { select: { participants: true } } },
    orderBy: { date: "asc" },
  });

  const summaries = events.map((e: (typeof events)[number]) =>
    toEventSummary(e)
  );

  return NextResponse.json({
    events: summaries,
    total: summaries.length,
  });
}
