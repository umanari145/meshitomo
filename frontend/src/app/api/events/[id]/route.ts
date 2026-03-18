import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { toEventDetail } from "@/lib/format-event";

/**
 * GET /api/events/:id
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      host: true,
      participants: { include: { user: true } },
    },
  });

  if (!event) {
    return NextResponse.json(
      { error: "イベントが見つかりません" },
      { status: 404 }
    );
  }

  return NextResponse.json(toEventDetail(event));
}
