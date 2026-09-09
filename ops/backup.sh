#!/usr/bin/env bash
# Dump the MongoDB database from the running compose stack into a timestamped
# gzip archive, then prune archives older than the retention window.
set -euo pipefail

cd "$(dirname "$0")/.."
[ -f .env ] && set -a && . ./.env && set +a

BACKUP_DIR="${BACKUP_DIR:-./backups}"
MONGO_DB="${MONGO_DB:-task_manager}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"

mkdir -p "$BACKUP_DIR"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
archive="$BACKUP_DIR/${MONGO_DB}-${stamp}.archive.gz"

echo "Backing up '$MONGO_DB' -> $archive"
docker compose exec -T mongo \
  mongodump --db="$MONGO_DB" --archive --gzip > "$archive"

echo "Pruning backups older than ${RETENTION_DAYS} days"
find "$BACKUP_DIR" -name "${MONGO_DB}-*.archive.gz" -mtime "+${RETENTION_DAYS}" -delete

echo "Done: $(du -h "$archive" | cut -f1) $archive"
