import { NextRequest, NextResponse } from "next/server";
import { sampleEvents } from "@/lib/sample-events";
import type { EventSummary } from "@/types/event";

/**
 * GET /api/events
 *
 * クエリパラメータ:
 *   area     - エリアで絞り込み（例: 新宿）
 *   category - カテゴリで絞り込み（例: 焼肉）
 *   status   - ステータスで絞り込み（recruiting / confirmed / completed）
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const area = searchParams.get("area");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

  let filtered = sampleEvents;

  if (area) {
    filtered = filtered.filter((e) => e.area === area);
  }
  if (category) {
    filtered = filtered.filter((e) => e.category === category);
  }
  if (status) {
    filtered = filtered.filter((e) => e.status === status);
  }

  const summaries: EventSummary[] = filtered.map((e) => ({
    id: e.id,
    title: e.title,
    restaurant: e.restaurant,
    date: e.date,
    area: e.area,
    budget: e.budget,
    currentMembers: e.currentMembers,
    maxMembers: e.maxMembers,
    status: e.status,
  }));

  return NextResponse.json({
    events: summaries,
    total: summaries.length,
  });
}
