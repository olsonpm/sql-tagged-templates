#! /usr/bin/env sh

cp package.json package.json.bak
pnpm lean-package --copy 'sideEffects' \
  --input package.json \
  --output package.json
