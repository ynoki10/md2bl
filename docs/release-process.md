# リリース手順（自動化済み）

Conventional Commits 形式でコミットして main にマージするだけ。
release-please が Release PR を自動作成・更新し、Release PR をマージすると自動でリリースされる。

## 詳細フロー

1. `feat:` / `fix:` コミットが main に入る
2. release-please が「Release PR」を自動作成・更新（CHANGELOG・package.json のバージョンを更新）
3. Release PR をマージ → Git タグ・GitHub Release・npm publish が自動実行

## 認証・トークン

- **release-please**: `RELEASE_PLEASE_TOKEN`（GitHub Fine-grained PAT）を使用。`GITHUB_TOKEN` では PR 作成時に CI がトリガーされないため。
- **npm publish**: [Trusted Publishing](https://docs.npmjs.com/trusted-publishers/)（OIDC）を使用。npm トークン不要。npmjs.com 側でリポジトリ・ワークフローを登録済み。

## バージョニング規則

| コミット種別 | バージョン変更 |
|---|---|
| `fix:` | PATCH (0.1.0 → 0.1.1) |
| `feat:` | MINOR (0.1.0 → 0.2.0) |
| `feat!:` / `BREAKING CHANGE:` | v0.x の間は MINOR、v1.0.0 以降は MAJOR |
