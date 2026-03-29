import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type JoinResponse = { ok: true } | { ok: false; error: string };

/**
 * POST /api/events/:id/join — ログインユーザーがイベントに応募する
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<JoinResponse>> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "ログインが必要です" },
      { status: 401 },
    );
  }

  const { id: eventId } = await params;

  try {
    const outcome = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: { _count: { select: { participants: true } } },
      });

      if (!event) return "NOT_FOUND" as const;
      if (event.hostId === session.userId) return "HOST" as const;
      if (event.status !== "RECRUITING") return "NOT_RECRUITING" as const;

      const currentMembers = event._count.participants + 1;
      if (currentMembers >= event.maxMembers) return "FULL" as const;

      const existing = await tx.participant.findUnique({
        where: {
          eventId_userId: { eventId, userId: session.userId },
        },
      });
      if (existing) return "ALREADY" as const;

      await tx.participant.create({
        data: { eventId, userId: session.userId },
      });

      const newParticipantCount = event._count.participants + 1;
      const newTotalMembers = newParticipantCount + 1;
      if (newTotalMembers >= event.maxMembers) {
        await tx.event.update({
          where: { id: eventId },
          data: { status: "CONFIRMED" },
        });
      }

      return "OK" as const;
    });

    switch (outcome) {
      case "NOT_FOUND":
        return NextResponse.json(
          { ok: false, error: "イベントが見つかりません" },
          { status: 404 },
        );
      case "HOST":
        return NextResponse.json(
          { ok: false, error: "主催者は自分のイベントに応募できません" },
          { status: 400 },
        );
      case "NOT_RECRUITING":
        return NextResponse.json(
          { ok: false, error: "このイベントは現在応募を受け付けていません" },
          { status: 400 },
        );
      case "FULL":
        return NextResponse.json(
          { ok: false, error: "このイベントは満員です" },
          { status: 400 },
        );
      case "ALREADY":
        return NextResponse.json(
          { ok: false, error: "すでに応募済みです" },
          { status: 400 },
        );
      default:
        return NextResponse.json({ ok: true });
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "応募の処理に失敗しました" },
      { status: 500 },
    );
  }
}
