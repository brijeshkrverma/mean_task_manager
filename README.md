# MEAN Task Manager

A task manager built on MongoDB, Express, Angular and Node, with a Redis-backed
background worker, nginx in front of the SPA, and Docker Compose for local and
production runs.

## Layout

```
api/      Node.js + Express REST API (auth, tasks, health)
web/      Angular 18 standalone-component frontend
worker/   BullMQ worker for task side-effects
nginx/    nginx.conf + site config (serves the SPA, proxies /api)
ops/      backup.sh, restore.sh, deploy.sh
```

## Quick start (Docker)

```bash
cp .env.example .env       # then set JWT_SECRET
docker compose up --build
```

- Web: http://localhost:8080
- API: http://localhost:3000
- Readiness: http://localhost:3000/health/ready

## Local development

```bash
# terminal 1 — datastores
docker compose up -d mongo redis

# terminal 2 — api
cd api && npm install && npm run dev

# terminal 3 — worker
cd worker && npm install && npm run dev

# terminal 4 — web (proxies /api to localhost:3000)
cd web && npm install && npm start
```

## API

| Method | Path                 | Auth | Description              |
| ------ | -------------------- | ---- | ------------------------ |
| POST   | `/api/auth/register` | —    | Create an account        |
| POST   | `/api/auth/login`    | —    | Exchange creds for a JWT |
| GET    | `/api/auth/me`       | JWT  | Current user             |
| GET    | `/api/tasks`         | JWT  | List (filter + paginate) |
| POST   | `/api/tasks`         | JWT  | Create                   |
| GET    | `/api/tasks/:id`     | JWT  | Fetch one                |
| PATCH  | `/api/tasks/:id`     | JWT  | Update                   |
| DELETE | `/api/tasks/:id`     | JWT  | Delete                   |
| GET    | `/health/live`       | —    | Liveness                 |
| GET    | `/health/ready`      | —    | Readiness (mongo, redis) |

Authenticate with `Authorization: Bearer <token>`.

## Configuration

All settings come from environment variables — see [.env.example](.env.example).
`JWT_SECRET` is required; the compose file refuses to start without it.

## Ops

```bash
ops/backup.sh                        # timestamped, gzipped mongodump
ops/restore.sh backups/<file>.gz     # drops + restores the database
ops/deploy.sh                        # ssh to DEPLOY_HOST, rebuild, roll
```

## CI/CD

- `.github/workflows/ci.yml` — installs, tests and builds each package, then
  builds all Docker images.
- `.github/workflows/deploy.yml` — runs `ops/deploy.sh` after a green CI run on
  `main` (or manually). Needs the `DEPLOY_SSH_KEY`, `DEPLOY_HOST`, `DEPLOY_USER`
  and `DEPLOY_PATH` secrets.
