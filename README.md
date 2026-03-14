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

### インフラ

| 技術 | 用途 |
|------|------|
| Docker / Docker Compose | 開発環境 |

## 開発環境の起動

```bash
docker compose up --build
```

http://localhost:3000 でアクセスできます。

## ドキュメント

`docs/` フォルダに設計ドキュメントを格納しています。

| ファイル | 内容 |
|---------|------|
| [URD.md](docs/URD.md) | ユーザー要件定義書 — ユーザー視点の機能要件（登録・イベント管理・検索・信頼スコア・安全対策など） |
| [PRD.md](docs/PRD.md) | 要件定義書 — システム全体の要件定義（機能要件・非機能要件・技術仕様を含む） |
| [screen-transition.md](docs/screen-transition.md) | 画面遷移図 — 全画面の遷移フローと認証要件（Mermaid図付き） |

## 画面モック

`mockups/index.html` をブラウザで開くと、全画面のインタラクティブなモックを確認できます。

```bash
open mockups/index.html
```

- **Tailwind CSS** を使用（CDN読み込み）
- 全13画面をJavaScriptで画面遷移シミュレーション
- 未ログイン／ログイン済みの状態切り替え対応
- 右下の「🎛 画面切替」パネルから任意の画面にジャンプ可能

