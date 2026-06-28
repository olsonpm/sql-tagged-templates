#! /usr/bin/env sh

# I'm leaving integration tests out of CI/CD for now since they be slooow and
# likely unnecessary

pnpm eslint \
  && pnpm prettier-check \
  && pnpm markdown-toc-check \
  && pnpm check-markdown-links \
  && pnpm test-supported-node-versions \
  && pnpm coverage-check
