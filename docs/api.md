# ルーティング・API一覧

## ページルーティング

| パス | ファイル | 説明 | ログイン要否 |
|------|---------|------|------------|
| `/` | `src/app/page.tsx` | トップページ（イベントプレビュー含む） | 不要 |
| `/events` | `src/app/events/page.tsx` | イベント一覧ページ（エリア・カテゴリ・ステータスで絞り込み可） | 不要 |
| `/events/:id` | `src/app/events/[id]/page.tsx` | イベント詳細ページ | 不要（応募のみ必要） |
| `/login` | `src/app/login/page.tsx` | ログインページ | 不要 |

> **補足**: トップページはDBアクセスがあるため `export const dynamic = "force-dynamic"` を設定し、SSR（リクエスト時レンダリング）で動作します。

---

## API一覧

すべてのAPIは `export const dynamic = "force-dynamic"` により毎リクエスト時にDBを参照します。

### `GET /api/events`

イベント一覧を取得します。クエリパラメータで絞り込み可能です。

**ファイル**: `src/app/api/events/route.ts`

| クエリパラメータ | 型 | 説明 | 例 |
|---------------|---|------|---|
| `area` | string | エリアで絞り込み | `?area=新宿` |
| `category` | string | カテゴリで絞り込み | `?category=焼肉` |
| `status` | string | ステータスで絞り込み | `?status=RECRUITING` |

**レスポンス例:**

```json
{
  "events": [
    {
      "id": "uuid",
      "title": "🔥 焼肉食べ放題いきませんか！",
      "restaurant": "焼肉きんぐ 新宿西口店",
      "date": "3/20（木）",
      "area": "新宿",
      "budget": "3,000〜4,000円",
      "currentMembers": 2,
      "maxMembers": 4,
      "status": "recruiting"
    }
  ],
  "total": 1
}
```

---

### `GET /api/events/:id`

指定IDのイベント詳細（ホスト情報・参加者情報を含む）を取得します。

**ファイル**: `src/app/api/events/[id]/route.ts`

| パスパラメータ | 型 | 説明 |
|-------------|---|------|
| `id` | string (UUID) | イベントID |

**レスポンス例:**

```json
{
  "id": "uuid",
  "title": "🔥 焼肉食べ放題いきませんか！",
  "restaurant": "焼肉きんぐ 新宿西口店",
  "date": "3/20（木）",
  "time": "19:00",
  "address": "東京都新宿区西新宿1-xx-xx",
  "area": "新宿",
  "category": "焼肉",
  "subCategory": "ホルモン",
  "budget": "3,000〜4,000円",
  "currentMembers": 2,
  "maxMembers": 4,
  "genderFilter": "anyone",
  "status": "recruiting",
  "host": {
    "nickname": "たけし",
    "ageGroup": "30代",
    "gender": "男性",
    "trustScore": 4.8
  },
  "participants": [
    { "nickname": "ゆうき", "ageGroup": "20代", "gender": "男性" }
  ]
}
```

**エラーレスポンス（404）:**

```json
{ "error": "イベントが見つかりません" }
```
