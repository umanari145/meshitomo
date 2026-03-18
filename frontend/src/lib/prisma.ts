import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = new URL(process.env.DATABASE_URL!);

  // ローカル環境（localhost / 127.0.0.1 / docker の db サービス）以外は
  // クラウドDBとみなしてSSLを有効化する
  const LOCAL_HOSTS = ["localhost", "127.0.0.1", "db"];
  const isCloud = !LOCAL_HOSTS.includes(url.hostname);

  // DATABASE_URL に ?ssl=true や ?sslaccept=strict が含まれている場合も SSL ON
  const hasSSLParam =
    url.searchParams.has("ssl") ||
    url.searchParams.has("sslaccept") ||
    url.searchParams.has("sslcert");

  const useSSL = isCloud || hasSSLParam;

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    // TiDB Cloud / PlanetScale 等はSSLが必須
    // rejectUnauthorized: false はプロバイダーの中間CA証明書を信頼する設定
    ...(useSSL ? { ssl: { rejectUnauthorized: false } } : {}),
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
