import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "メシとも — 飲み・食べ放題マッチングサービス",
  description:
    "予算・食べたいもの・地域でつながる飲み・食べ放題マッチングサービス。一人飲みが好きだけど、たまには誰かと食べ放題に行きたい人のためのサービスです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
