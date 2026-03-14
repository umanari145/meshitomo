import { NextResponse } from "next/server";
import { sampleEvents } from "@/lib/sample-events";

/**
 * GET /api/events/:id
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = sampleEvents.find((e) => e.id === id);

  if (!event) {
    return NextResponse.json(
      { error: "イベントが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(event);
}
