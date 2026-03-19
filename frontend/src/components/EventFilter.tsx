"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

const AREAS = ["新宿", "渋谷", "池袋", "恵比寿", "新橋", "銀座", "六本木"];
const CATEGORIES = [
  "焼肉",
  "寿司",
  "中華",
  "イタリアン",
  "居酒屋",
  "焼き鳥",
  "ラーメン",
];
const STATUSES = [
  { value: "RECRUITING", label: "募集中" },
  { value: "CONFIRMED", label: "確定" },
  { value: "COMPLETED", label: "開催済み" },
];

type Props = {
  // Server Componentが searchParams から読み取った現在の選択値をpropsで受け取る
  selectedAreas: string[];
  selectedCategories: string[];
  selectedStatuses: string[];
};

export default function EventFilter({
  selectedAreas,
  selectedCategories,
  selectedStatuses,
}: Props) {
  const router = useRouter();

  const hasFilter =
    selectedAreas.length > 0 ||
    selectedCategories.length > 0 ||
    selectedStatuses.length > 0;

  // チェックON/OFF → URLを更新してServer Componentに再取得させる
  const toggle = useCallback(
    (key: "area" | "category" | "status", value: string, current: string[]) => {
      const params = new URLSearchParams();

      // 変更しない他のキーの値をそのまま引き継ぐ
      selectedAreas.forEach((v) => params.append("area", v));
      selectedCategories.forEach((v) => params.append("category", v));
      selectedStatuses.forEach((v) => params.append("status", v));

      // 対象キーを一度削除して再セット
      params.delete(key);
      const next = current.includes(value)
        ? current.filter((v) => v !== value) // チェック外す
        : [...current, value]; // チェック入れる
      next.forEach((v) => params.append(key, v));

      const qs = params.toString();
      router.push(`/events${qs ? `?${qs}` : ""}`);
    },
    [router, selectedAreas, selectedCategories, selectedStatuses]
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-8">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        絞り込み
      </p>

      <div className="flex flex-col gap-5">
        <FilterGroup
          label="エリア"
          items={AREAS.map((a) => ({ value: a, label: a }))}
          selected={selectedAreas}
          onToggle={(v) => toggle("area", v, selectedAreas)}
        />
        <FilterGroup
          label="カテゴリ"
          items={CATEGORIES.map((c) => ({ value: c, label: c }))}
          selected={selectedCategories}
          onToggle={(v) => toggle("category", v, selectedCategories)}
        />
        <FilterGroup
          label="ステータス"
          items={STATUSES}
          selected={selectedStatuses}
          onToggle={(v) => toggle("status", v, selectedStatuses)}
        />
      </div>

      {hasFilter && (
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {selectedAreas.length +
              selectedCategories.length +
              selectedStatuses.length}
            件の条件を適用中
          </p>
          <button
            onClick={() => router.push("/events")}
            className="text-xs text-brand-500 hover:text-brand-700 font-semibold transition"
          >
            ✕ リセット
          </button>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  items,
  selected,
  onToggle,
}: {
  label: string;
  items: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item) => {
          const checked = selected.includes(item.value);
          return (
            <label
              key={item.value}
              className="flex items-center gap-1.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(item.value)}
                className="w-4 h-4 rounded border-gray-300 accent-orange-500 cursor-pointer"
              />
              <span
                className={`text-sm transition ${
                  checked
                    ? "text-brand-600 font-semibold"
                    : "text-gray-600 group-hover:text-brand-500"
                }`}
              >
                {item.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
