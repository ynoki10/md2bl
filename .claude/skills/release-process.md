---
name: release-process
description: リリース手順（release-please による自動化フロー）
user_invocable: true
---

## リリース手順（自動化済み）

Conventional Commits 形式でコミットして main にマージするだけ。
release-please が Release PR を自動作成・更新し、Release PR をマージすると自動でリリースされる。

### 詳細フロー

1. `feat:` / `fix:` コミットが main に入る
2. release-please が「Release PR」を自動作成・更新（CHANGELOG・package.json のバージョンを更新）
3. Release PR をマージ → Git タグ・GitHub Release・npm publish が自動実行

### バージョニング規則

| コミット種別 | バージョン変更 |
|---|---|
| `fix:` | PATCH (0.1.0 → 0.1.1) |
| `feat:` | MINOR (0.1.0 → 0.2.0) |
| `feat!:` / `BREAKING CHANGE:` | v0.x の間は MINOR、v1.0.0 以降は MAJOR |
