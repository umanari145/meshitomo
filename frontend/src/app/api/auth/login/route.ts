import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = { ok: true } | { ok: false; error: string };

export async function POST(
  req: NextRequest
): Promise<NextResponse<LoginResponse>> {
  const body = (await req.json()) as Partial<LoginRequest>;
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "メールアドレスとパスワードを入力してください" },
      { status: 400 }
    );
  }

  // ユーザー検索
  const user = await prisma.user.findUnique({ where: { email } });

  // ユーザーが存在しない場合もパスワード不一致と同じメッセージにする（ユーザー列挙攻撃の防止）
  if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
    return NextResponse.json(
      { ok: false, error: "メールアドレスまたはパスワードが正しくありません" },
      { status: 401 }
    );
  }

  // セッションCookieを発行
  await createSession({ userId: user.id, nickname: user.nickname });

  return NextResponse.json({ ok: true });
}
