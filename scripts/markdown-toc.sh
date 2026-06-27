#! /usr/bin/sh

cmd="${1}"

pnpm markdown-toc-gen "${cmd}" ./readme.md \
  ./docs/api-reference.md \
  ./docs/migrating-from-sts.md \
  ./docs/more-usage-info.md
