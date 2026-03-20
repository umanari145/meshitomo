# メシとも

飲み・食べ放題マッチングサービス

## 技術スタック

### フロントエンド (`frontend/`)

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Node.js | 22 (Alpine) | ランタイム |
| Next.js | 16.1.6 | フレームワーク（App Router） |
| React | 19.2.3 | UIライブラリ |
| TypeScript | 5.x | 型安全 |
| Tailwind CSS | 4.x | スタイリング |
| ESLint | 9.x | リンター |

### データベース

| 技術 | バージョン | 用途 |
|------|-----------|------|
| MySQL(https://tidbcloud.com/) | 8.0 | データベース |
| Prisma | 7.x | ORM / マイグレーション |

### インフラ

| 技術 | 用途 |
|------|------|
| Docker / Docker Compose | 開発環境 |
| phpMyAdmin | DB管理ツール |

## 開発環境の起動

```bash
# 初回起動（イメージのビルド込み）
docker compose up --build

# 2回目以降
docker compose up

# バックグラウンドで起動
docker compose up -d

# 停止
docker compose down

# 停止 + DBデータも削除（初期化したい場合）
docker compose down -v
```

| サービス | URL |
|---------|-----|
| フロントエンド (Next.js) | http://localhost:3000 |
| phpMyAdmin | http://localhost:8080 |
| MySQL | `localhost:3306` |

## npm scripts（`frontend/package.json`）

| スクリプト | コマンド | 説明 |
|-----------|---------|------|
| `dev` | `next dev` | 開発サーバーを起動（ホットリロード対応） |
| `build` | `prisma generate && next build` | ローカル用ビルド。Prismaクライアント生成 → Next.jsビルド |
| `build:vercel` | `prisma generate && prisma migrate deploy && prisma db seed && next build` | Vercelデプロイ用。マイグレーション適用 → seed投入 → ビルド |
| `postinstall` | `prisma generate` | `npm install` 後に自動実行。Prismaクライアントを生成（Dockerではスキップ） |
| `start` | `next start` | 本番サーバーを起動（`build` 後に使用） |
| `lint` | `eslint` | コードのリント実行 |
| `prisma:generate` | `prisma generate` | Prismaクライアントを手動で再生成 |
| `prisma:migrate` | `prisma migrate dev` | 開発環境用マイグレーション（新規作成＋適用） |
| `prisma:studio` | `prisma studio` | ブラウザでDBのデータを閲覧・編集 |
| `prisma:seed` | `prisma db seed` | CSVからサンプルデータをDBに投入（upsertのため何度でも安全） |

## コマンド一覧

### Prisma（DB操作）

Prisma はTypeScript対応のORMで、スキーマ定義・マイグレーション・型安全なDBクエリを提供します。
コマンドはすべて **コンテナ内** で実行します。

```bash
# マイグレーション実行（スキーマ変更後にテーブルへ反映）
docker compose exec frontend npx prisma migrate dev --name <変更名>

# マイグレーション状態の確認
docker compose exec frontend npx prisma migrate status

# Prisma Client の再生成（スキーマ変更後、型定義を更新）
docker compose exec frontend npx prisma generate

```

#### ファイル構成

```
frontend/
├── prisma/
│   ├── schema.prisma              ← モデル定義（ここを編集してmigrate dev）
│   └── migrations/                ← マイグレーション履歴（自動生成・Gitで管理）
│       └── 20260314235622_init/
│           └── migration.sql
├── prisma.config.ts               ← Prisma設定（DB接続先など）
├── src/
│   ├── generated/prisma/          ← 自動生成クライアント（.gitignore済）
│   └── lib/prisma.ts              ← アプリ内で使うシングルトンインスタンス
└── .env                           ← DATABASE_URL（.gitignore済）
```

#### 開発の流れ

1. `prisma/schema.prisma` でモデルを追加・変更する
2. `npx prisma migrate dev --name <変更名>` でマイグレーション実行
3. 自動的に Prisma Client が再生成され、新しい型が使えるようになる
4. `src/lib/prisma.ts` の `prisma` インスタンス経由でクエリを実行する

#### コード内での使い方

```typescript
import { prisma } from "@/lib/prisma";

// イベント一覧を取得
const events = await prisma.event.findMany({
  where: { status: "RECRUITING" },
  include: { host: true },
});

// イベントを作成
const event = await prisma.event.create({
  data: {
    title: "焼肉食べ放題！",
    hostId: userId,
    // ...
  },
});
```

### Next.js

```bash
# コンテナ内でビルド
docker compose exec frontend npm run build

# コンテナ内でリント
docker compose exec frontend npm run lint

# キャッシュなしで完全にフロントをビルド
docker compose build --no-cache frontend

# マイグレーション（初回のみ）
docker compose exec frontend npx prisma migrate dev 

# CSVからseed投入
docker compose exec frontend npx prisma db seed

```

### MySQL に直接接続

```bash
docker compose exec db mysql -u meshitomo -p'Meshi_t0m0!' meshitomo
```

## 認証方式の設計判断

### セッション管理に JWT を採用した理由

ログイン状態の管理には **JWT（JSON Web Token）を httpOnly Cookie に保存する方式** を採用しています。

#### Vercel（サーバーレス）との相性

Vercel はリクエストごとに異なるサーバーインスタンスで処理される可能性があります。従来の DBセッション方式ではインスタンスをまたいでセッションを共有する仕組みが必要になりますが、JWT はサーバー側に状態を持たないため、どのインスタンスでも秘密鍵さえあれば検証できます。

```
DBセッション方式（不向き）
  ユーザー → サーバーA → セッションDB確認 ✅
  ユーザー → サーバーB → セッションが見つからない ❌

JWT方式（向いている）
  ユーザー → サーバーA → CookieのJWTを検証するだけ ✅
  ユーザー → サーバーB → CookieのJWTを検証するだけ ✅
```

#### 各方式との比較

| 方式 | メリット | デメリット | 採用判断 |
|------|---------|-----------|---------|
| **JWT（採用）** | DBアクセス不要・サーバーレス向き | 強制ログアウトが難しい | ✅ 現フェーズに最適 |
| DBセッション | 即時無効化できる | 毎リクエストDBアクセスが必要 | 現時点ではオーバースペック |
| NextAuth.js | 機能が豊富・OAuth対応 | 設定が複雑・学習コスト高 | 後から移行可能 |

#### 既知の制限と今後の方針

- **強制ログアウトが難しい**: 発行済みトークンを途中で無効化できない（有効期限7日）
- ブロック機能やアカウント停止が必要になった時点で、NextAuth.js への移行またはDBセッション方式の追加を検討する

#### 関連ファイル

| ファイル | 役割 |
|---------|------|
| `src/lib/session.ts` | JWTの署名・検証・Cookie操作ユーティリティ |
| `src/app/api/auth/login/route.ts` | ログインAPI（bcrypt照合 → Cookie発行） |
| `src/app/api/auth/logout/route.ts` | ログアウトAPI（Cookieを削除） |
| `src/components/Header.tsx` | 非同期 Server Component（Cookie読み取り → 表示切替） |

#### 必要な環境変数

```bash
SESSION_SECRET=your-random-secret-key-here  # JWT署名に使う秘密鍵（本番では十分にランダムな値を設定）
```

---

## ドキュメント

`docs/` フォルダに設計ドキュメントを格納しています。

| ファイル | 内容 |
|---------|------|
| [URD.md](docs/URD.md) | ユーザー要件定義書 — ユーザー視点の機能要件（登録・イベント管理・検索・信頼スコア・安全対策など） |
| [PRD.md](docs/PRD.md) | 要件定義書 — システム全体の要件定義（機能要件・非機能要件・技術仕様を含む） |
| [screen-transition.md](docs/screen-transition.md) | 画面遷移図 — 全画面の遷移フローと認証要件（Mermaid図付き） |
| [api.md](docs/api.md) | ルーティング・API一覧 — 実装済みページとAPIエンドポイントの仕様 |

## 画面モック

`mockups/index.html` をブラウザで開くと、全画面のインタラクティブなモックを確認できます。

```bash
open mockups/index.html
```

- **Tailwind CSS** を使用（CDN読み込み）
- 全13画面をJavaScriptで画面遷移シミュレーション
- 未ログイン／ログイン済みの状態切り替え対応
- 右下の「🎛 画面切替」パネルから任意の画面にジャンプ可能

