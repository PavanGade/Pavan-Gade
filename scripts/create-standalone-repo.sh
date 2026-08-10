#!/usr/bin/env bash
# Create a standalone GitHub repository for the Invetsors Circle LP landing page.
# Requires: gh (authenticated), git
#
# Usage:
#   ./scripts/create-standalone-repo.sh
#   ./scripts/create-standalone-repo.sh PavanGade Invetsors-Circle-LP --public

set -euo pipefail

OWNER="${1:-PavanGade}"
REPO_NAME="${2:-Invetsors-Circle-LP}"
VISIBILITY="${3:---private}" # --private or --public
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)/invetsors-circle-lp"

cleanup() { rm -rf "$(dirname "$TMP")"; }
trap cleanup EXIT

echo "→ Building clean export at $TMP"
mkdir -p "$TMP"
tar --exclude=node_modules \
    --exclude=.next \
    --exclude=out \
    --exclude=.git \
    --exclude=legacy \
    --exclude=.cursor \
    -C "$ROOT" -cf - . | tar -xf - -C "$TMP"

cd "$TMP"
# Standalone branding
if [[ -f README.md ]]; then
  sed -i.bak '1s/.*/# Invetsors Circle LP/' README.md && rm -f README.md.bak
fi
node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.name='invetsors-circle-lp';fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n')"

git init -b main
git add -A
git commit -m "Initial commit: Invetsors Circle LP landing page"

FULL="$OWNER/$REPO_NAME"
echo "→ Creating GitHub repo $FULL ($VISIBILITY)"
gh repo create "$FULL" "$VISIBILITY" \
  --description "Invetsors Circle LP — premium investment landing page" \
  --source=. \
  --remote=origin \
  --push

echo ""
echo "Done: https://github.com/$FULL"
