# メシとも — 画面遷移図

> **作成日:** 2026-03-14
> **バージョン:** 2.0

---

## 設計方針

ECサイトと同様に、**イベント一覧・詳細は未ログインでも閲覧可能**とする。
ただし、**応募・イベント作成・マイページ等のアクションにはログインが必要**。
未ログイン状態でアクション系ボタンを押した場合、ログイン画面へ誘導する。

---

## 全体遷移図

```mermaid
flowchart TD
    %% ===== 未ログインでもアクセス可 =====
    TOP[トップページ]
    EVENT_LIST[イベント一覧画面]
    EVENT_DETAIL[イベント詳細画面]

    %% ===== 認証系 =====
    REG[ユーザー登録画面]
    LOGIN[ログイン画面]
    PW_RESET[パスワードリセット画面]
    PROFILE_SETUP[プロフィール設定画面]

    %% ===== ログイン必須 =====
    EVENT_CREATE[イベント作成画面]
    EVENT_EDIT[イベント編集画面]
    MYPAGE[マイページ]
    PROFILE_EDIT[プロフィール編集画面]
    ATTENDANCE[出欠報告画面]
    REPORT[通報画面]

    %% ----- 未ログインでも可能な閲覧フロー -----
    TOP -->|イベントを探す| EVENT_LIST
    TOP -->|新規登録| REG
    TOP -->|ログイン| LOGIN
    EVENT_LIST -->|イベントを選択| EVENT_DETAIL
    EVENT_DETAIL -->|戻る| EVENT_LIST

    %% ----- 認証フロー -----
    LOGIN -->|パスワードを忘れた| PW_RESET
    PW_RESET -->|メール送信後| LOGIN
    REG -->|登録完了| PROFILE_SETUP
    PROFILE_SETUP -->|設定完了| EVENT_LIST
    LOGIN -->|ログイン成功| EVENT_LIST

    %% ----- 未ログインからの誘導 -----
    EVENT_DETAIL -->|応募する（未ログイン）| LOGIN
    EVENT_LIST -->|イベントを作成（未ログイン）| LOGIN

    %% ----- ログイン済みのアクション -----
    EVENT_DETAIL -->|応募する / 応募取消（ログイン済）| EVENT_DETAIL
    EVENT_DETAIL -->|通報・ブロック| REPORT
    REPORT -->|送信完了| EVENT_DETAIL
    EVENT_LIST -->|イベントを作成（ログイン済）| EVENT_CREATE
    EVENT_CREATE -->|投稿完了| EVENT_LIST

    %% ----- マイページ（ログイン必須） -----
    EVENT_LIST -->|マイページ| MYPAGE
    MYPAGE -->|プロフィール編集| PROFILE_EDIT
    PROFILE_EDIT -->|保存| MYPAGE
    MYPAGE -->|参加予定イベントを選択| EVENT_DETAIL
    MYPAGE -->|主催イベントを選択| EVENT_DETAIL
    MYPAGE -->|主催イベントを編集| EVENT_EDIT
    EVENT_EDIT -->|保存| EVENT_DETAIL
    MYPAGE -->|出欠を報告する| ATTENDANCE
    ATTENDANCE -->|報告完了| MYPAGE

    %% ----- 共通ナビ -----
    MYPAGE -->|ログアウト| TOP
    EVENT_LIST -.->|常時アクセス可| MYPAGE
    MYPAGE -.->|常時アクセス可| EVENT_LIST

    %% ----- スタイリング -----
    style TOP fill:#4A90D9,color:#fff
    style REG fill:#7B68EE,color:#fff
    style LOGIN fill:#7B68EE,color:#fff
    style PW_RESET fill:#7B68EE,color:#fff
    style PROFILE_SETUP fill:#7B68EE,color:#fff
    style EVENT_LIST fill:#2ECC71,color:#fff
    style EVENT_DETAIL fill:#27AE60,color:#fff
    style EVENT_CREATE fill:#F39C12,color:#fff
    style EVENT_EDIT fill:#F39C12,color:#fff
    style MYPAGE fill:#E74C3C,color:#fff
    style PROFILE_EDIT fill:#E74C3C,color:#fff
    style ATTENDANCE fill:#E67E22,color:#fff
    style REPORT fill:#95A5A6,color:#fff
```

---

## フロー別の説明

### 1. 閲覧フロー（未ログインでもアクセス可）

```mermaid
flowchart LR
    TOP[トップページ] -->|イベントを探す| LIST[イベント一覧]
    LIST -->|選択| DETAIL[イベント詳細]
    DETAIL -->|戻る| LIST

    style TOP fill:#4A90D9,color:#fff
    style LIST fill:#2ECC71,color:#fff
    style DETAIL fill:#27AE60,color:#fff
```

| 遷移 | トリガー | 対応要件 | ログイン |
|------|---------|---------|---------|
| トップ → イベント一覧 | 「イベントを探す」ボタン | S-001 | 不要 |
| 一覧 → 詳細 | イベントカード選択 | S-001 | 不要 |
| 一覧での絞り込み | フィルター操作 | S-002〜S-005, S-007 | 不要 |

> **ポイント:** 未ログインユーザーでもイベントの閲覧・検索が可能。
> ただし性別フィルター（S-006）はプロフィール情報が必要なため、ログイン済みユーザーにのみ自動適用される。

---

### 2. 認証フロー

```mermaid
flowchart LR
    TOP[トップページ] -->|新規登録| REG[ユーザー登録]
    TOP -->|ログイン| LOGIN[ログイン]
    DETAIL[イベント詳細] -->|応募する| LOGIN
    LIST[イベント一覧] -->|作成する| LOGIN
    LOGIN -->|PW忘れた| PW_RESET[PW リセット]
    PW_RESET -->|メール送信| LOGIN
    REG -->|登録完了| PROF[プロフィール設定]
    PROF -->|設定完了| LIST2[イベント一覧]
    LOGIN -->|成功| LIST2

    style TOP fill:#4A90D9,color:#fff
    style LIST fill:#2ECC71,color:#fff
    style DETAIL fill:#27AE60,color:#fff
    style LOGIN fill:#7B68EE,color:#fff
    style REG fill:#7B68EE,color:#fff
    style PW_RESET fill:#7B68EE,color:#fff
    style PROF fill:#7B68EE,color:#fff
    style LIST2 fill:#2ECC71,color:#fff
```

| 遷移 | トリガー | 対応要件 |
|------|---------|---------|
| トップ → 登録 | 「新規登録」ボタン | U-001, U-002 |
| トップ → ログイン | 「ログイン」ボタン | U-003 |
| イベント詳細 → ログイン | 未ログインで「応募する」押下 | — |
| イベント一覧 → ログイン | 未ログインで「イベントを作成」押下 | — |
| 登録 → プロフィール設定 | 登録完了後に自動遷移 | U-010〜U-013 |
| プロフィール設定 → イベント一覧 | 必須項目入力後 | — |
| ログイン → PW リセット | 「パスワードを忘れた方」リンク | U-004 |
| ログイン → イベント一覧 | 認証成功後 | U-003 |

> **ポイント:** 未ログイン状態でアクション系ボタン（応募・作成）を押すと、ログイン画面に誘導。
> ログイン/登録完了後、元の画面に戻る（リダイレクトバック）ことが望ましい。

---

### 3. イベント参加フロー（ログイン必須）

```mermaid
flowchart LR
    LIST[イベント一覧] -->|選択| DETAIL[イベント詳細]
    DETAIL -->|応募する| DETAIL
    DETAIL -->|応募取消| DETAIL
    DETAIL -->|戻る| LIST

    style LIST fill:#2ECC71,color:#fff
    style DETAIL fill:#27AE60,color:#fff
```

| 遷移 | トリガー | 対応要件 | ログイン |
|------|---------|---------|---------|
| 詳細で応募 | 「応募する」ボタン | E-020, E-023, E-024 | 必須 |
| 詳細で応募取消 | 「応募を取り消す」ボタン | E-021 | 必須 |

---

### 4. イベント作成フロー（ログイン必須）

```mermaid
flowchart LR
    LIST[イベント一覧] -->|作成| CREATE[イベント作成]
    CREATE -->|投稿完了| LIST
    MYPAGE[マイページ] -->|編集| EDIT[イベント編集]
    EDIT -->|保存| DETAIL[イベント詳細]

    style LIST fill:#2ECC71,color:#fff
    style CREATE fill:#F39C12,color:#fff
    style EDIT fill:#F39C12,color:#fff
    style MYPAGE fill:#E74C3C,color:#fff
    style DETAIL fill:#27AE60,color:#fff
```

| 遷移 | トリガー | 対応要件 | ログイン |
|------|---------|---------|---------|
| 一覧 → 作成 | 「イベントを作成」ボタン | E-001〜E-008 | 必須 |
| 作成 → 一覧 | 投稿完了後 | — | — |
| マイページ → 編集 | 主催イベントの「編集」 | E-009 | 必須 |
| マイページでイベント削除 | 「削除」ボタン | E-010 | 必須 |

---

### 5. マイページフロー（ログイン必須）

```mermaid
flowchart TD
    MYPAGE[マイページ]
    PROF[プロフィール編集]
    DETAIL[イベント詳細]
    ATT[出欠報告]
    LOGOUT[トップページ]

    MYPAGE -->|プロフィール編集| PROF
    PROF -->|保存| MYPAGE
    MYPAGE -->|参加予定イベント| DETAIL
    MYPAGE -->|主催イベント| DETAIL
    MYPAGE -->|出欠報告| ATT
    ATT -->|報告完了| MYPAGE
    MYPAGE -->|ログアウト| LOGOUT
    MYPAGE -->|退会| LOGOUT

    style MYPAGE fill:#E74C3C,color:#fff
    style PROF fill:#E74C3C,color:#fff
    style DETAIL fill:#27AE60,color:#fff
    style ATT fill:#E67E22,color:#fff
    style LOGOUT fill:#4A90D9,color:#fff
```

| 遷移 | トリガー | 対応要件 | ログイン |
|------|---------|---------|---------|
| マイページ → プロフィール編集 | 「編集」ボタン | U-014 | 必須 |
| マイページ → イベント詳細 | 参加/主催イベントを選択 | E-022, E-011 | 必須 |
| マイページ → 出欠報告 | 開催済みイベントの「報告」 | T-002 | 必須 |
| マイページ → ログアウト | 「ログアウト」 | U-003 | 必須 |
| マイページ → 退会 | 「退会する」 | U-005 | 必須 |

---

### 6. 安全対策フロー（ログイン必須）

```mermaid
flowchart LR
    DETAIL[イベント詳細] -->|通報| REPORT[通報画面]
    DETAIL -->|ブロック| DETAIL
    REPORT -->|送信| DETAIL

    style DETAIL fill:#27AE60,color:#fff
    style REPORT fill:#95A5A6,color:#fff
```

| 遷移 | トリガー | 対応要件 | ログイン |
|------|---------|---------|---------|
| 詳細 → 通報 | 「通報する」ボタン | SF-001 | 必須 |
| 詳細でブロック | 「ブロック」ボタン（確認ダイアログ） | SF-002, SF-003 | 必須 |

---

## 画面一覧と認証要件

| 色 | カテゴリ | 画面 | ログイン |
|----|---------|------|---------|
| 🔵 青 | ランディング | トップページ | 不要 |
| 🟢 緑 | イベント閲覧 | イベント一覧 / イベント詳細 | **不要**（閲覧のみ） |
| 🟣 紫 | 認証系 | 登録 / ログイン / PW リセット / プロフィール初期設定 | 不要 |
| 🟠 オレンジ | イベント操作 | イベント作成 / 編集 / 出欠報告 | **必須** |
| 🔴 赤 | ユーザー管理 | マイページ / プロフィール編集 | **必須** |
| ⚪ グレー | 安全対策 | 通報画面 | **必須** |

---

## グローバルナビゲーション

### 未ログインユーザー

すべての画面で以下のナビゲーションを常時表示する。

| ナビ項目 | 遷移先 |
|---------|--------|
| イベント一覧 | イベント一覧画面 |
| ログイン | ログイン画面 |
| 新規登録 | ユーザー登録画面 |

### ログイン済みユーザー

すべての画面で以下のナビゲーションを常時表示する。

| ナビ項目 | 遷移先 |
|---------|--------|
| イベント一覧 | イベント一覧画面 |
| イベント作成 | イベント作成画面 |
| マイページ | マイページ |

---

## 未ログイン時のUI挙動まとめ

| 画面 | 要素 | 未ログイン時の挙動 |
|------|------|------------------|
| イベント一覧 | イベントカード | 通常通り表示・タップで詳細へ遷移 |
| イベント一覧 | フィルター | 予算・カテゴリ・地域・日付は使用可。性別フィルターは非表示または無効 |
| イベント一覧 | 「イベントを作成」ボタン | タップでログイン画面へ誘導 |
| イベント詳細 | イベント情報 | 通常通り表示 |
| イベント詳細 | 「応募する」ボタン | タップでログイン画面へ誘導（「参加するにはログインが必要です」等のメッセージ表示） |
| イベント詳細 | 通報・ブロック | 非表示 |
