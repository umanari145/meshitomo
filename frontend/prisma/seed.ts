import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Prisma クライアントのセットアップ ──────────────────────────────────
const dbUrl = new URL(process.env.DATABASE_URL!);

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "db"];
const isCloud = !LOCAL_HOSTS.includes(dbUrl.hostname);
const hasSSLParam =
  dbUrl.searchParams.has("ssl") ||
  dbUrl.searchParams.has("sslaccept") ||
  dbUrl.searchParams.has("sslcert");
const useSSL = isCloud || hasSSLParam;

const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
  ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
});
const prisma = new PrismaClient({ adapter });

// ── CSV パーサー ──────────────────────────────────────────────────────
type Row = Record<string, string>;

function parseCsv(filePath: string): Row[] {
  const content = fs.readFileSync(path.resolve(__dirname, filePath), "utf-8");
  const lines = content
    .trim()
    .split("\n")
    .map((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

// ── メイン ───────────────────────────────────────────────────────────
async function main() {
  // ── Users：メールアドレスをキーにupsert（何度実行しても安全）─────────
  const userRows = parseCsv("data/users.csv");
  for (const r of userRows) {
    await prisma.user.upsert({
      where: { email: r.email },
      update: {},   // 既存ユーザーは上書きしない
      create: {
        email: r.email,
        hashedPassword: r.hashedPassword,
        birthDate: new Date(r.birthDate),
        nickname: r.nickname,
        ageGroup: r.ageGroup,
        gender: r.gender,
        foodPreference: r.foodPreference,
        trustScore: parseFloat(r.trustScore),
      },
    });
  }

  // メールでUserを引けるMapを作成
  const userMap = new Map(
    (await prisma.user.findMany()).map((u) => [u.email, u])
  );

  // ── Events：タイトル＋ホストIDをキーに、なければ作成 ────────────────
  const eventRows = parseCsv("data/events.csv");
  for (const r of eventRows) {
    const host = userMap.get(r.hostEmail);
    if (!host) {
      console.warn(`Host not found: ${r.hostEmail}`);
      continue;
    }
    const exists = await prisma.event.findFirst({
      where: { title: r.title, hostId: host.id },
    });
    if (!exists) {
      await prisma.event.create({
        data: {
          title: r.title,
          date: new Date(r.date),
          time: r.time,
          restaurantName: r.restaurantName,
          address: r.address,
          prefecture: r.prefecture,
          area: r.area,
          category: r.category,
          subCategory: r.subCategory || null,
          budgetMin: parseInt(r.budgetMin),
          budgetMax: parseInt(r.budgetMax),
          maxMembers: parseInt(r.maxMembers),
          genderFilter: r.genderFilter,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: r.status as any,
          hostId: host.id,
        },
      });
    }
  }

  // イベントタイトルでEventを引けるMapを作成
  const eventMap = new Map(
    (await prisma.event.findMany()).map((e) => [e.title, e])
  );

  // ── Participants：重複チェックしてからinsert ──────────────────────────
  const participantRows = parseCsv("data/participants.csv");
  for (const r of participantRows) {
    const event = eventMap.get(r.eventTitle);
    const user = userMap.get(r.participantEmail);
    if (!event || !user) {
      console.warn(
        `Participant mapping not found: ${r.eventTitle} / ${r.participantEmail}`
      );
      continue;
    }
    // @@unique([eventId, userId]) を利用してupsert
    await prisma.participant.upsert({
      where: { eventId_userId: { eventId: event.id, userId: user.id } },
      update: {},
      create: { eventId: event.id, userId: user.id },
    });
  }

  const userCount = await prisma.user.count();
  const eventCount = await prisma.event.count();
  const participantCount = await prisma.participant.count();
  console.log(
    `✅ Seed complete: ${userCount} users, ${eventCount} events, ${participantCount} participants`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
