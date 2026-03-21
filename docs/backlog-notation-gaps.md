# Backlog記法との差分・対象外項目

Backlog公式ヘルプ（[Backlog記法](https://support-ja.backlog.com/hc/ja/articles/360035641594)・[Markdown記法](https://support-ja.backlog.com/hc/ja/articles/360036145833)）と md2bl の実装を突き合わせた結果をまとめる。

調査日: 2026-03-21

## 対応不要な項目

### Markdown 側に対応する概念がないもの

| Backlog記法 | 説明 | 理由 |
|---|---|---|
| `&color(red) { テキスト }` | 文字色指定 | Markdown に色指定の構文がない |
| `&color(#fff, #8abe00) { テキスト }` | 背景色指定 | 同上 |

### Backlog 環境依存の機能

| 記法 | 説明 | md2bl での扱い |
|---|---|---|
| `BLG-104` / `[[BLG-87]]` | 課題へのリンク | テキストノードとしてそのまま出力される。Backlog UI が自動リンク化する |
| `[[Home]]` | Wiki ページリンク | 同上 |
| `#rev(11)` / `#rev(app:abcdefg)` | SVN/Git リビジョンリンク | 入力に含まれていればそのまま出力される |
| `#attach(file.zip:11)` | Wiki 添付ファイルリンク | 入力に含まれていればそのまま出力される |
| `#contents` / `[toc]` | 目次自動生成 | 対応予定: [#41](https://github.com/ynoki10/md2bl/issues/41) で `[toc]` → `#contents` 変換を実装予定 |

### Backlog記法に対応する出力構文がないもの

| Markdown 入力 | 説明 | md2bl での扱い |
|---|---|---|
| テーブルのセル結合 (`\|\|`) | Backlog 独自 Markdown 拡張 | 標準 GFM 入力に現れない。GFM パーサは `\|\|` を空セルとして解釈し、空セルがそのまま出力される。対応不要 |

### 対応予定のもの

| Markdown 入力 | 説明 | md2bl での扱い |
|---|---|---|
| `{quote}...{/quote}` | ブロック引用 | 対応予定: [#42](https://github.com/ynoki10/md2bl/issues/42) で `quoteStyle` オプションを導入予定。デフォルト `auto`（1行 → `>`、複数行 → `{quote}`） |
| 定義リスト (`term\n: definition`) | PHP Markdown Extra 拡張 | 対応予定: [#47](https://github.com/ynoki10/md2bl/issues/47) で妥当なBacklog記法へのフォールバック変換を実装予定 |
| `<details>` / `<summary>` | 折りたたみ表示 | 対応予定: [#48](https://github.com/ynoki10/md2bl/issues/48) で妥当なBacklog記法へのフォールバック変換を実装予定 |

## コード言語サポートについて

Backlog記法の `{code:}` マクロがサポートする言語は **`java` と `cs`（C#）の2つのみ**。

- `{code:java}` → Eclipse 標準文字色で表示
- `{code:cs}` → Visual C# .NET 標準文字色で表示
- `{code}` → 汎用的な色付け

Markdown の ` ```lang ` で指定された言語が `java` / `cs` 以外の場合は `{code}` にフォールバックする。

参考: [Backlog Enterprise コードマクロ](https://backlog.com/ja/enterprise-help/userguide/userguide195/)

## 画像表示について

Backlog記法の `#image()` は公式ヘルプでは Wiki 添付ファイル ID での使用のみ記載されているが、`#image(URL)` で外部 URL 画像も表示可能。

参考: [Backlogで添付画像やGyazoの画像を表示する方法](https://qiita.com/p_on_ro/items/1d1f2f6aed0484a80cd1)
