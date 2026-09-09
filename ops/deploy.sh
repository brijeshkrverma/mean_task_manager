#!/usr/bin/env bash
# Pull the latest code on the deploy host, rebuild images and roll the stack.
# Run locally: ops/deploy.sh   (uses DEPLOY_HOST/DEPLOY_USER/DEPLOY_PATH from .env)
# Run on the host: REMOTE=0 ops/deploy.sh
set -euo pipefail

cd "$(dirname "$0")/.."
[ -f .env ] && set -a && . ./.env && set +a

REMOTE="${REMOTE:-1}"
DEPLOY_PATH="${DEPLOY_PATH:-/srv/mean-task-manager}"
BRANCH="${DEPLOY_BRANCH:-main}"

deploy_local() {
  echo "==> Fetching $BRANCH"
  git fetch --prune origin
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"

  echo "==> Building images"
  docker compose build --pull

  echo "==> Rolling services"
  docker compose up -d --remove-orphans

  echo "==> Pruning dangling images"
  docker image prune -f

  echo "==> Waiting for API readiness"
  for _ in $(seq 1 30); do
    if curl -fsS "http://localhost:${API_PORT:-3000}/health/ready" >/dev/null; then
      echo "API is ready."
      exit 0
    fi
    sleep 2
  done

  echo "API did not become ready in time." >&2
  docker compose logs --tail=100 api >&2
  exit 1
}

if [ "$REMOTE" = "0" ]; then
  deploy_local
fi

: "${DEPLOY_HOST:?DEPLOY_HOST is required for remote deploy}"
: "${DEPLOY_USER:?DEPLOY_USER is required for remote deploy}"

echo "==> Deploying to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
ssh "${DEPLOY_USER}@${DEPLOY_HOST}" \
  "cd '${DEPLOY_PATH}' && REMOTE=0 DEPLOY_BRANCH='${BRANCH}' ops/deploy.sh"
