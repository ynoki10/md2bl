# Changelog

## [0.4.0](https://github.com/ynoki10/md2bl/compare/md2bl-v0.3.0...md2bl-v0.4.0) (2026-04-04)


### ⚠ BREAKING CHANGES

* default blockquote output changes from always '>' to auto-detecting single vs multi-line.

### Features

* CLI enhancements (quoteStyle, multiple files, clipboard) ([#92](https://github.com/ynoki10/md2bl/issues/92)) ([59f0e2a](https://github.com/ynoki10/md2bl/commit/59f0e2a5719fdcd9c0f34edfea2b5755e059a893))


### Bug Fixes

* use --input-type=module for Node 18 top-level await compat ([d3b5dc3](https://github.com/ynoki10/md2bl/commit/d3b5dc3e53527b319b3e2fc2bf78c67e3e406841))

## [0.3.0](https://github.com/ynoki10/md2bl/compare/md2bl-v0.2.0...md2bl-v0.3.0) (2026-03-23)


### Features

* convert [toc] to #contents ([#41](https://github.com/ynoki10/md2bl/issues/41)) ([#68](https://github.com/ynoki10/md2bl/issues/68)) ([90836dc](https://github.com/ynoki10/md2bl/commit/90836dc566b415515f3561be3ce7276c524a70c8))
* convert images to #image(URL) ([#56](https://github.com/ynoki10/md2bl/issues/56)) ([c01984b](https://github.com/ynoki10/md2bl/commit/c01984bb7705de12fb95bf77f6ab16f944c45f5c)), closes [#40](https://github.com/ynoki10/md2bl/issues/40)
* handle loose list items and block elements in list items ([#65](https://github.com/ynoki10/md2bl/issues/65)) ([2898cbd](https://github.com/ynoki10/md2bl/commit/2898cbd01fb4f346756bcf5e1493ee4092c54e64))
* output {code:java}/{code:cs} for supported languages ([#53](https://github.com/ynoki10/md2bl/issues/53)) ([47a286d](https://github.com/ynoki10/md2bl/commit/47a286d58cc20a7afe65fcfa8de846a1bbfd6afe)), closes [#38](https://github.com/ynoki10/md2bl/issues/38)
* support checklist items (- [ ] / - [x]) ([#55](https://github.com/ynoki10/md2bl/issues/55)) ([8bcb1f1](https://github.com/ynoki10/md2bl/commit/8bcb1f1acd1554f2029b075a487f7a8e010d53bf)), closes [#39](https://github.com/ynoki10/md2bl/issues/39)

## [0.2.0](https://github.com/ynoki10/md2bl/compare/md2bl-v0.1.3...md2bl-v0.2.0) (2026-03-21)


### Features

* add programmatic API support for library usage ([e5b8bea](https://github.com/ynoki10/md2bl/commit/e5b8beadb81bf72aabae3f45d6364167e68a7ced))
* add programmatic API support for library usage ([255be1a](https://github.com/ynoki10/md2bl/commit/255be1af17423d6982c3167df6b87048224671d6))

## [0.1.3](https://github.com/ynoki10/md2bl/compare/md2bl-v0.1.2...md2bl-v0.1.3) (2026-03-14)


### Bug Fixes

* normalize repository url in package.json ([#2](https://github.com/ynoki10/md2bl/issues/2)) ([d88ac1a](https://github.com/ynoki10/md2bl/commit/d88ac1addc4ec8eeb0476cc0efc2101069f5ec3b))
* package.json に engines フィールドを追加 ([#33](https://github.com/ynoki10/md2bl/issues/33)) ([a2f615e](https://github.com/ynoki10/md2bl/commit/a2f615e73f119ab8db3fd8fa0f825f6229834554))
* release-please で PAT を使用し CI トリガーを有効化 ([#28](https://github.com/ynoki10/md2bl/issues/28)) ([5d67e98](https://github.com/ynoki10/md2bl/commit/5d67e9857de88bd219b78c320b68b0792af1ccb0))
* テーブルヘッダー記法を行末 h 付与に修正 ([#25](https://github.com/ynoki10/md2bl/issues/25)) ([9363dbc](https://github.com/ynoki10/md2bl/commit/9363dbc58bcfcda2d7964832c95382290e4f6aad))
* パッケージ説明文を改善 ([#30](https://github.com/ynoki10/md2bl/issues/30)) ([9f02354](https://github.com/ynoki10/md2bl/commit/9f02354d755be31346b31420cfc720dc1ce1b59d))
* リスト間の空行が維持されない ([#19](https://github.com/ynoki10/md2bl/issues/19)) ([#27](https://github.com/ynoki10/md2bl/issues/27)) ([eeb4c7a](https://github.com/ynoki10/md2bl/commit/eeb4c7a36feab6ecab9a769ebfc2c9bba506ced4))

## [0.1.2](https://github.com/ynoki10/md2bl/compare/md2bl-v0.1.1...md2bl-v0.1.2) (2026-03-14)


### Bug Fixes

* normalize repository url in package.json ([#2](https://github.com/ynoki10/md2bl/issues/2)) ([d88ac1a](https://github.com/ynoki10/md2bl/commit/d88ac1addc4ec8eeb0476cc0efc2101069f5ec3b))
* release-please で PAT を使用し CI トリガーを有効化 ([#28](https://github.com/ynoki10/md2bl/issues/28)) ([5d67e98](https://github.com/ynoki10/md2bl/commit/5d67e9857de88bd219b78c320b68b0792af1ccb0))
* テーブルヘッダー記法を行末 h 付与に修正 ([#25](https://github.com/ynoki10/md2bl/issues/25)) ([9363dbc](https://github.com/ynoki10/md2bl/commit/9363dbc58bcfcda2d7964832c95382290e4f6aad))
* パッケージ説明文を改善 ([#30](https://github.com/ynoki10/md2bl/issues/30)) ([9f02354](https://github.com/ynoki10/md2bl/commit/9f02354d755be31346b31420cfc720dc1ce1b59d))
* リスト間の空行が維持されない ([#19](https://github.com/ynoki10/md2bl/issues/19)) ([#27](https://github.com/ynoki10/md2bl/issues/27)) ([eeb4c7a](https://github.com/ynoki10/md2bl/commit/eeb4c7a36feab6ecab9a769ebfc2c9bba506ced4))

## [0.1.1](https://github.com/ynoki10/md2bl/compare/md2bl-v0.1.0...md2bl-v0.1.1) (2026-03-14)


### Bug Fixes

* normalize repository url in package.json ([#2](https://github.com/ynoki10/md2bl/issues/2)) ([d88ac1a](https://github.com/ynoki10/md2bl/commit/d88ac1addc4ec8eeb0476cc0efc2101069f5ec3b))
* release-please で PAT を使用し CI トリガーを有効化 ([#28](https://github.com/ynoki10/md2bl/issues/28)) ([5d67e98](https://github.com/ynoki10/md2bl/commit/5d67e9857de88bd219b78c320b68b0792af1ccb0))
* テーブルヘッダー記法を行末 h 付与に修正 ([#25](https://github.com/ynoki10/md2bl/issues/25)) ([9363dbc](https://github.com/ynoki10/md2bl/commit/9363dbc58bcfcda2d7964832c95382290e4f6aad))
* リスト間の空行が維持されない ([#19](https://github.com/ynoki10/md2bl/issues/19)) ([#27](https://github.com/ynoki10/md2bl/issues/27)) ([eeb4c7a](https://github.com/ynoki10/md2bl/commit/eeb4c7a36feab6ecab9a769ebfc2c9bba506ced4))
