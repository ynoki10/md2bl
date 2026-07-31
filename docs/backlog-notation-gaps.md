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
| `#rev(11)` / `#rev(app:abcdefg)` | SVN/Git リビジョンリンク | 同上 |
| `#attach(file.zip:11)` | Wiki 添付ファイルリンク | 同上 |

### Backlog記法に対応する出力構文がないもの

| Markdown 入力 | 説明 | md2bl での扱い |
|---|---|---|
| テーブルのセル結合 (`\|\|`) | Backlog 独自 Markdown 拡張 | 標準 GFM 入力に現れない。GFM パーサは `\|\|` を空セルとして解釈し、空セルがそのまま出力される。対応不要 |

## 対応予定のもの

| 記法 | 説明 | md2bl での扱い |
|---|---|---|
| `#contents` / `[toc]` | 目次自動生成 | 対応予定: [#41](https://github.com/ynoki10/md2bl/issues/41) で `[toc]` → `#contents` 変換を実装予定 |
| `> blockquote` | ブロック引用 | 対応予定: [#42](https://github.com/ynoki10/md2bl/issues/42) で `quoteStyle` オプションを導入予定。デフォルト `auto`（1行 → `>`、複数行 → `{quote}`） |
| 定義リスト (`term\n: definition`) | PHP Markdown Extra 拡張 | 対応予定: [#47](https://github.com/ynoki10/md2bl/issues/47) で妥当なBacklog記法へのフォールバック変換を実装予定 |
| `<details>` / `<summary>` | 折りたたみ表示 | 対応予定: [#48](https://github.com/ynoki10/md2bl/issues/48) で妥当なBacklog記法へのフォールバック変換を実装予定 |

## 既知の制限

### テーブルセル内のパイプ文字

テーブルセル内のコンテンツに `|`（パイプ）が含まれる場合、Backlog のテーブルパーサーがカラム区切りと誤認し、表示が崩れる。

```markdown
| コマンド | 説明 |
| --- | --- |
| `cat input.md \| md2bl` | stdinから変換 |
```

Backlog記法にはテーブルセル内のパイプをエスケープする構文がないため、md2bl 側では回避できない。

### 未対応ノードは警告つきで本文から除去される

（2026-07-31 / md2bl 0.4.2 時点）

変換できないノードに当たると stderr に警告を出し、**stdout の本文からはそのノードを取り除く**。stdout をそのまま Backlog に投稿する使い方では、投稿後のプレビューで初めて欠落に気づくことになる。

現在このパスに入る入力:

| 入力 | 警告 | 関連 issue |
|---|---|---|
| プレーンテキスト中の `<...>`（例: `?type=<key>`） | `raw HTML is not supported...` | [#110](https://github.com/ynoki10/md2bl/issues/110) |
| HTML ブロック（例: `<div>本文</div>`）。タグだけでなく内側のテキストも失われる | 同上 | [#115](https://github.com/ynoki10/md2bl/issues/115) |
| `<br>`。GFM のテーブルセル内は生の改行を書けないため、セル内改行の表現手段が無くなる | 同上 | [#112](https://github.com/ynoki10/md2bl/issues/112) |
| 参照リンク・参照画像 (`[text][ref]`) と定義行。リンクテキスト・alt ごと失われる | `unsupported node type "linkReference"` / `"imageReference"` / `"definition"` | [#111](https://github.com/ynoki10/md2bl/issues/111) |
| 脚注 (`[^1]`) と定義。注記の本文も失われる | `unsupported node type "footnoteReference"` / `"footnoteDefinition"` | [#113](https://github.com/ynoki10/md2bl/issues/113) |

警告に入力の位置情報が含まれないため、長い文書では欠落箇所の特定が難しい（[#114](https://github.com/ynoki10/md2bl/issues/114)）。

呼び出し側の回避策:

- 山括弧を文字として残したいだけなら `&lt;` / `&gt;` で書く（`&lt;key&gt;` → `<key>`。警告も出ない）
- コード表示にしてよいならインラインコードで囲む（`` `<key>` `` → `{code}<key>{/code}`）
- 変換時に stderr の警告を確認し、出ていたら投稿前に本文を目視する

### Unicode 絵文字は Backlog API に拒否される

（2026-06-01 に実地確認）

md2bl は Unicode 絵文字（`🙏` `✅` `⚠️` 等）を変換せずそのまま出力する。ただし Backlog API は課題・PR・コメントの本文でこれを受け付けず、投稿が次のエラーで失敗する。

```
Incorrect String: %F0%9F%99%8F...
```

4 バイト文字を格納できない列に当たっている挙動に見える。この制約は Backlog の公式ドキュメントには記載を見つけられていない。

Backlog 絵文字記法（`:pray:` / `:white_check_mark:` / `:warning:` 等）は問題なく通る。呼び出し側で置換するか、変換対応（[#116](https://github.com/ynoki10/md2bl/issues/116)）を待つ。

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
