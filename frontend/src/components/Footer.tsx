import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-white font-bold text-lg">🍻 メシとも</span>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="hover:text-white transition">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              プライバシーポリシー
            </Link>
            <Link href="/contact" className="hover:text-white transition">
              お問い合わせ
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-gray-600 mt-6">
          &copy; 2026 メシとも. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
