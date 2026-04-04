#!/bin/bash
FILE=$(jq -r '.tool_input.file_path')
cd "$CLAUDE_PROJECT_DIR"
npx biome check --write "$FILE" 2>&1 || true
