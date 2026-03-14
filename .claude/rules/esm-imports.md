---
description: ESM プロジェクトのため import 時は .js 拡張子が必要
globs:
  - "src/**/*.ts"
---

ESMプロジェクト (`"type": "module"`) のため、import時は `.js` 拡張子が必要（TypeScriptソースでも同様）。

例:
```ts
import { convert } from './converter.js';
```
