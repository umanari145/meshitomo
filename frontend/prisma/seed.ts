import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Prisma クライアントのセットアップ ──────────────────────────────────
const dbUrl = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  database: dbUrl.pathname.slice(1),
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
  // 既存データを全削除（順番に注意）
  await prisma.participant.deleteMany();
  await prisma.attendanceReport.deleteMany();
  await prisma.report.deleteMany();
  await prisma.block.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // ── Users ──────────────────────────────────────────────────────────
  const userRows = parseCsv("data/users.csv");
  await prisma.user.createMany({
    data: userRows.map((r) => ({
      email: r.email,
      hashedPassword: r.hashedPassword,
      birthDate: new Date(r.birthDate),
      nickname: r.nickname,
      ageGroup: r.ageGroup,
      gender: r.gender,
      foodPreference: r.foodPreference,
      trustScore: parseFloat(r.trustScore),
    })),
  });
  console.log("Users created");
  console.log(userRows);
  // メールでUserを引けるMapを作成
  const userMap = new Map(
    (await prisma.user.findMany()).map((u) => [u.email, u])
  );
  console.log("Users created");
  // ── Events ─────────────────────────────────────────────────────────
  const eventRows = parseCsv("data/events.csv");
  console.log("Events created");
  console.log(eventRows);
  for (const r of eventRows) {
    const host = userMap.get(r.hostEmail);
    if (!host) {
      console.warn(`Host not found: ${r.hostEmail}`);
      continue;
    }
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

  // イベントタイトルでEventを引けるMapを作成
  const eventMap = new Map(
    (await prisma.event.findMany()).map((e) => [e.title, e])
  );

  // ── Participants ────────────────────────────────────────────────────
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
    await prisma.participant.create({
      data: { eventId: event.id, userId: user.id },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
