#!/usr/bin/env bash
set -Eeuo pipefail
[[ $# == 1 && ! -e $1 && ! -L $1 ]] || { echo 'Usage: package.sh NEW_OUTPUT_DIRECTORY' >&2; exit 1; }
here=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
mkdir -p -- "$1"
for file in compose.yml Caddyfile README.md; do cp -- "$here/$file" "$1/$file"; done
(cd -- "$1" && sha256sum compose.yml Caddyfile README.md) >"$1/checksums.sha256"
