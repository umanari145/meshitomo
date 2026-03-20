"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-red-500 px-3 py-2 rounded-lg transition"
    >
      ログアウト
    </button>
  );
}
