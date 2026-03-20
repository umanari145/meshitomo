import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "session";
const EXPIRATION = "7d";

// JWT署名に使う秘密鍵（環境変数から取得。未設定時は開発用フォールバック）
function getSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ?? "dev-secret-please-change-in-production";
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
  nickname: string;
};

/** JWTを生成してhttpOnly Cookieにセットする */
export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRATION)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7日
  });
}

/** CookieからJWTを検証してセッション情報を返す。未ログインまたは期限切れはnull */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Cookieを削除してログアウト */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
