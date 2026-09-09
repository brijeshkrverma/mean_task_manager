#!/usr/bin/env bash
# Restore a backup produced by backup.sh. This DROPS the target database first,
# so it asks for confirmation unless FORCE=1 is set.
set -euo pipefail

cd "$(dirname "$0")/.."
[ -f .env ] && set -a && . ./.env && set +a

archive="${1:-}"
MONGO_DB="${MONGO_DB:-task_manager}"

if [ -z "$archive" ]; then
  echo "Usage: ops/restore.sh <path-to-archive.gz>" >&2
  exit 1
fi

if [ ! -f "$archive" ]; then
  echo "No such archive: $archive" >&2
  exit 1
fi

if [ "${FORCE:-0}" != "1" ]; then
  read -r -p "This will DROP database '$MONGO_DB' and restore from $archive. Continue? [y/N] " reply
  case "$reply" in
    [yY]*) ;;
    *) echo "Aborted."; exit 1 ;;
  esac
fi

echo "Restoring '$MONGO_DB' from $archive"
docker compose exec -T mongo \
  mongorestore --archive --gzip --drop --nsInclude="${MONGO_DB}.*" < "$archive"

echo "Restore complete."
