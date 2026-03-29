import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

export type RegisterRequest = {
  email: string;
  password: string;
  nickname: string;
  ageGroup: string;
  gender: string;
  foodPreference: string;
  birthDate: string; // "YYYY-MM-DD"
};

export type RegisterResponse =
  | { ok: true; userId: string }
  | { ok: false; error: string };

export async function POST(
  req: NextRequest,
): Promise<NextResponse<RegisterResponse>> {
  const body = (await req.json()) as Partial<RegisterRequest>;

  // ── バリデーション ───────────────────────────────────────────────
  const {
    email,
    password,
    nickname,
    ageGroup,
    gender,
    foodPreference,
    birthDate,
  } = body;

  if (
    !email ||
    !password ||
    !nickname ||
    !ageGroup ||
    !gender ||
    !foodPreference ||
    !birthDate
  ) {
    return NextResponse.json(
      { ok: false, error: "必須項目が不足しています" },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "パスワードは8文字以上で設定してください" },
      { status: 400 },
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { ok: false, error: "メールアドレスの形式が正しくありません" },
      { status: 400 },
    );
  }

  // ── メールアドレスの重複チェック ─────────────────────────────────
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { ok: false, error: "このメールアドレスはすでに使用されています" },
      { status: 409 },
    );
  }

  // ── パスワードハッシュ化 ─────────────────────────────────────────
  // saltRounds: 10 が一般的なセキュリティと速度のバランス
  const hashedPassword = await bcrypt.hash(password, 10);

  // ── ユーザー作成 ────────────────────────────────────────────────
  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword,
      nickname,
      ageGroup,
      gender,
      foodPreference,
      birthDate: new Date(birthDate),
    },
  });

  // ── セッションCookieを発行 ───────────────────────────────────────
  await createSession({ userId: user.id, nickname: user.nickname });

  return NextResponse.json({ ok: true, userId: user.id }, { status: 201 });
}
