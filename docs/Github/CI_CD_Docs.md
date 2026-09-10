Create a complete **step-by-step practical CI/CD training and testing guide** for my existing GitHub repository:

Repository:
`Mean_Project`

Application:
**MEAN Task Manager**

Stack:

* Angular frontend
* Node.js + Express backend
* MongoDB
* Docker
* Nginx
* GitHub
* GitHub Actions

## MAIN GOAL

I already have the application code pushed to GitHub.

I want to **practically build, test, break, fix, deploy, monitor, and rollback a complete CI/CD pipeline using GitHub Actions**.

Do not teach CI/CD only as theory.

Treat this as a hands-on laboratory.

The final result must be a working pipeline where:

```text
Developer
   ↓
Feature Branch
   ↓
Commit
   ↓
Push
   ↓
Pull Request
   ↓
CI
   ├── Install dependencies
   ├── Lint
   ├── Test
   ├── Build Angular
   ├── Build backend
   └── Docker build
   ↓
Merge to main
   ↓
CD
   ├── Build production image
   ├── Push image
   ├── Deploy
   ├── Health check
   └── Smoke test
   ↓
Monitoring
   ↓
Rollback if failure
```

---

# IMPORTANT TEACHING RULE

Explain everything in very simple English.

For every command and every GitHub Actions section explain:

1. What is this?
2. Why do we need it?
3. What exactly happens?
4. Where does it happen?
5. What input does it use?
6. What output does it produce?
7. How do I verify it?
8. What happens if it fails?
9. How do I fix it?
10. How do I rollback it?

Never assume I already understand CI/CD terminology.

---

# SECTION 1 — UNDERSTAND THE COMPLETE PIPELINE

First explain:

* Git
* GitHub
* GitHub Actions
* CI
* CD
* Workflow
* Job
* Step
* Runner
* Artifact
* Secret
* Environment
* Deployment
* Health check
* Smoke test
* Rollback

Use very simple examples.

Create this diagram:

```text
Local Computer
      ↓
Git
      ↓
GitHub Repository
      ↓
GitHub Actions
      ↓
CI
      ↓
Build + Test
      ↓
CD
      ↓
Deployment
      ↓
Health Check
      ↓
Production
```

---

# SECTION 2 — CHECK MY CURRENT REPOSITORY

Show how to verify:

* current branch
* remote URL
* existing workflow files
* Dockerfiles
* docker-compose
* package.json
* Angular project
* backend project
* environment files

Commands:

```bash
git status
git branch
git remote -v
```

Explain every command.

Also explain how to inspect:

```text
.github/workflows/
```

---

# SECTION 3 — BRANCHING STRATEGY

Use:

```text
main
 ├── feature/login
 ├── feature/task-crud
 └── feature/task-filter
```

Explain why:

* `main` is production
* `feature/*` is development

For the laboratory create:

```bash
git switch main
git pull origin main
git switch -c feature/ci-test
```

Explain every command.

---

# SECTION 4 — CREATE FIRST CI WORKFLOW

Create:

```text
.github/workflows/ci.yml
```

The workflow must run on:

```yaml
pull_request:
  branches:
    - main

push:
  branches:
    - main
```

Use Node.js 20 unless the project requires another currently supported version.

Pipeline:

```text
Checkout
↓
Setup Node
↓
npm ci
↓
Lint
↓
Test
↓
Angular production build
↓
Backend test
```

Use separate working directories:

```text
web/
api/
worker/
```

Do not invent paths that conflict with the repository structure.

---

# SECTION 5 — EXPLAIN EVERY LINE OF YAML

For every line explain:

```yaml
name:
on:
jobs:
runs-on:
steps:
uses:
with:
run:
working-directory:
```

Explain:

* YAML indentation
* `:` meaning
* `-` meaning
* `${{ }}` meaning
* environment variables
* secrets

Create a "YAML for beginners" mini section.

---

# SECTION 6 — FIRST CI TEST

Create a feature branch.

Make a harmless change such as:

```text
README update
```

Then:

```bash
git add .
git commit -m "test: verify CI pipeline"
git push -u origin feature/ci-test
```

Create Pull Request:

```text
feature/ci-test → main
```

Explain what happens automatically.

Show expected GitHub Actions flow.

Expected:

```text
✅ Checkout
✅ Setup Node
✅ Install
✅ Test
✅ Build
```

---

# SECTION 7 — INTENTIONALLY BREAK CI

This is mandatory.

Create several controlled failures.

### Failure A — broken test

Change a test so it fails.

Push.

Explain:

```text
CI
 ↓
Test
 ↓
FAIL
 ↓
PR blocked
```

Teach how to inspect logs.

Fix the test.

Push again.

Verify CI turns green.

---

# SECTION 8 — BREAK ANGULAR BUILD

Introduce a temporary Angular build error.

Push.

Observe:

```text
npm ci ✅
test ✅
build ❌
```

Explain:

* how to find failing step
* how to read logs
* how to reproduce locally
* how to fix
* how to rerun

Then restore the correct code.

---

# SECTION 9 — BREAK BACKEND

Create a temporary backend startup problem.

CI should detect the issue if a startup/health test is included.

Teach:

```text
build
↓
start backend
↓
health check
↓
FAIL
```

Use:

```text
GET /api/health
```

Expected:

```json
{
  "status": "ok"
}
```

---

# SECTION 10 — BUILD DOCKER IMAGE IN CI

Add:

```text
docker build
```

for:

```text
web
api
worker
```

Explain:

* Dockerfile
* image
* container
* build context
* tag

Use predictable tags such as:

```text
commit SHA
```

and explain why commit SHA is better than only using:

```text
latest
```

---

# SECTION 11 — DOCKER IMAGE TESTING

After building images:

* start container
* check container status
* check logs
* check health endpoint
* stop container
* remove container

Commands:

```bash
docker images
docker ps
docker ps -a
docker logs
docker inspect
```

Explain each command.

---

# SECTION 12 — USE GITHUB CONTAINER REGISTRY

Teach how to push Docker image to:

**GitHub Container Registry (GHCR)**

Explain:

```text
GitHub Actions
      ↓
Docker build
      ↓
GHCR
      ↓
Docker image
```

Use GitHub Actions secrets only where required.

Explain authentication safely.

Do NOT hardcode passwords/tokens.

---

# SECTION 13 — CREATE CD WORKFLOW

Create:

```text
.github/workflows/deploy.yml
```

Trigger:

```yaml
push:
  branches:
    - main
```

Pipeline:

```text
Checkout
↓
Build Docker image
↓
Tag image
↓
Push image to GHCR
↓
Deploy
↓
Health check
↓
Smoke test
```

Explain each stage.

---

# SECTION 14 — DEPLOYMENT TARGET

Use a free or low-cost environment where practical.

Important:

Do NOT claim a service is permanently free.

Clearly classify:

* free
* free tier
* trial
* paid

If a free VPS is not reliably available, use:

* local Linux VM
* WSL
* Docker
* GitHub-hosted test environment

The goal is learning the deployment pipeline, not spending money.

---

# SECTION 15 — ENVIRONMENT MANAGEMENT

Create:

```text
Development
Staging/Test
Production
```

Explain:

* environment variables
* `.env`
* GitHub Secrets
* GitHub Variables
* production secrets
* database URL
* JWT secret
* Redis URL

Never put secrets in Git.

---

# SECTION 16 — GITHUB SECRETS

Teach exact process:

GitHub Repository
↓
Settings
↓
Secrets and variables
↓
Actions
↓
New repository secret

Create examples such as:

```text
MONGODB_URI
JWT_SECRET
DEPLOY_HOST
DEPLOY_USER
DEPLOY_SSH_KEY
```

Do not ask the learner to expose real secrets in the documentation.

Explain how secrets are referenced:

```yaml
${{ secrets.MONGODB_URI }}
```

---

# SECTION 17 — SSH DEPLOYMENT

Teach how GitHub Actions can securely deploy to a server using SSH.

Explain:

```text
GitHub Actions Runner
        ↓ SSH
Server
        ↓
Docker Compose
        ↓
Application
```

Explain:

* SSH key
* private key
* public key
* known_hosts
* server user
* least privilege

Never print private keys in logs.

---

# SECTION 18 — DEPLOY WITH DOCKER COMPOSE

Use:

```text
docker-compose.yml
```

Services:

```text
web
api
worker
mongodb
redis
nginx
```

Teach:

```bash
docker compose pull
docker compose up -d
docker compose ps
docker compose logs
```

Explain exactly what each command does.

---

# SECTION 19 — HEALTH CHECK

Create proper backend health endpoint:

```text
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

Teach deployment verification:

```bash
curl http://SERVER_IP/api/health
```

If using HTTPS:

```bash
curl https://example.com/api/health
```

Explain:

* HTTP 200
* failed health check
* timeout
* connection refused

---

# SECTION 20 — SMOKE TEST

After deployment, automatically test:

1. API health
2. Frontend availability
3. authentication endpoint
4. basic task API

Do not make the smoke test too complex.

Explain why smoke tests are different from unit tests.

---

# SECTION 21 — MONITORING

Start with simple monitoring:

```text
/api/health
Docker logs
container status
CPU
memory
disk
```

Commands:

```bash
docker stats
docker ps
docker compose logs
```

Explain what each tells us.

Then explain future tools:

* Prometheus
* Grafana
* Loki
* alerting

Do not implement complex monitoring unless necessary.

---

# SECTION 22 — INTENTIONALLY BREAK PRODUCTION

This is mandatory.

Create controlled failures:

### Failure 1

Stop API container.

Expected:

```text
Health check fails
```

### Failure 2

Use wrong environment variable.

Expected:

```text
Application startup failure
```

### Failure 3

Deploy a broken image.

Expected:

```text
Smoke test failure
```

### Failure 4

Break Nginx configuration.

Expected:

```text
502/5xx
```

For each:

* detect
* inspect
* diagnose
* fix
* verify

---

# SECTION 23 — ROLLBACK

Implement real rollback.

Use image tags:

```text
app:<commit-sha>
```

Example:

```text
app:a12b45c
app:f76d831
```

Suppose:

```text
v1 = working
v2 = broken
```

Deploy:

```text
v1
 ↓
v2
 ↓
failure
 ↓
rollback
 ↓
v1
```

Teach:

```bash
docker compose pull
docker compose up -d
```

with the previous image version.

Also teach Git rollback:

```bash
git revert <commit>
git push
```

Explain:

Application rollback
vs
Git rollback
vs
Database rollback

Very important:

Do NOT imply database rollback is automatically safe.

---

# SECTION 24 — ARTIFACTS

Explain GitHub Actions artifacts.

Create an example:

```text
Angular build output
Test reports
Coverage reports
Logs
```

Teach:

* upload artifact
* download artifact
* retention

Explain when artifacts are useful.

---

# SECTION 25 — CACHING

Teach dependency caching:

```yaml
actions/setup-node
cache: npm
```

Explain:

* why caching speeds CI
* cache invalidation
* package-lock.json

---

# SECTION 26 — CI PERFORMANCE

Show how to optimize:

* npm ci
* caching
* parallel jobs
* dependency reuse
* avoid unnecessary builds

Do not over-optimize beginner workflows.

---

# SECTION 27 — BRANCH PROTECTION

Explain GitHub branch protection/rules for `main`.

Recommended:

* Pull Request required
* CI required
* no direct push
* reviews required where appropriate

Show conceptual settings.

---

# SECTION 28 — COMPLETE PRODUCTION FLOW

Create the final architecture:

```text
Developer
   ↓
feature branch
   ↓
Commit
   ↓
Push
   ↓
Pull Request
   ↓
Code Review
   ↓
GitHub Actions
   ├── npm ci
   ├── lint
   ├── tests
   ├── Angular build
   ├── Backend build
   └── Docker build
   ↓
Merge main
   ↓
GitHub Actions CD
   ↓
Docker image
   ↓
GHCR
   ↓
Server
   ↓
Docker Compose
   ↓
Nginx
   ↓
Angular + Node
   ↓
Health check
   ↓
Smoke test
   ↓
Monitoring
```

---

# SECTION 29 — FAILURE MATRIX

Create a table:

| Failure            | Where detected | Log to inspect   | Fix                | Rollback |
| ------------------ | -------------- | ---------------- | ------------------ | -------- |
| npm install        | CI             | install logs     | dependency fix     | no       |
| test failure       | CI             | test logs        | code/test fix      | no       |
| Angular build      | CI             | build logs       | code fix           | no       |
| Docker build       | CI             | Docker logs      | Dockerfile fix     | no       |
| deployment failure | CD             | deploy logs      | infrastructure fix | yes      |
| health check       | CD             | application logs | app/config fix     | yes      |
| Nginx 502          | Production     | nginx logs       | config/backend     | yes      |
| DB issue           | Production     | DB/app logs      | DB/config fix      | careful  |

---

# SECTION 30 — COMPLETE HANDS-ON LAB

Create a 10-step practical lab:

### Lab 1

Create feature branch.

### Lab 2

Create CI workflow.

### Lab 3

Open PR.

### Lab 4

Make CI pass.

### Lab 5

Break CI intentionally.

### Lab 6

Fix CI.

### Lab 7

Merge to main.

### Lab 8

Run CD deployment.

### Lab 9

Break production and rollback.

### Lab 10

Perform full end-to-end deployment again successfully.

Every lab must contain:

* Goal
* Starting state
* Commands
* Expected output
* What happened
* Verification
* Common errors
* Completion checklist

---

# SECTION 31 — FINAL PRACTICAL EXAM

The learner must be able to perform the following without copying blindly:

```text
1. Create feature branch
2. Commit code
3. Push branch
4. Open PR
5. Run CI
6. Inspect failed CI
7. Fix CI
8. Merge PR
9. Trigger CD
10. Build Docker image
11. Push image
12. Deploy
13. Check health
14. Check logs
15. Run smoke test
16. Break application
17. Detect failure
18. Rollback
19. Verify recovery
```

At the end calculate:

```text
Git:     __ / 100
CI:      __ / 100
CD:      __ / 100
Docker:  __ / 100
Deploy:  __ / 100
Monitor: __ / 100
Rollback:__ / 100
```

Then provide overall skill level:

```text
Beginner
Developing
Intermediate
Production Ready
```

---

# HTML DOCUMENT REQUIREMENTS

Create ONE complete standalone HTML file.

No external framework.

No CDN dependency.

No external JavaScript dependency.

Must work offline after saving.

Use:

HTML
CSS
Vanilla JavaScript

Design:

Professional developer/DevOps dashboard.

Use this palette:

Background:
#0F172A

Sidebar:
#111827

Cards:
#1E293B

Primary:
#3B82F6

Text:
#F8FAFC

Secondary:
#94A3B8

Border:
#334155

Success:
#22C55E

Warning:
#F59E0B

Error:
#EF4444

Code:
#020617

---

# REQUIRED UI

Include:

* Sidebar navigation
* Search
* Chapter progress
* Step progress
* Mark complete
* Previous/Next navigation
* Copy command buttons
* Expand/collapse explanations
* Warning boxes
* Error boxes
* Success boxes
* Architecture diagrams
* Command breakdown cards
* Expected output cards
* Troubleshooting tables
* Final checklist
* LocalStorage progress persistence

---

# COMMAND BREAKDOWN COMPONENT

For important commands show:

Example:

```text
git push -u origin main
```

Break:

```text
git
= Git program

push
= send local commits to remote

-u
= set upstream tracking

origin
= remote repository name

main
= target branch
```

Do the same style for GitHub Actions commands and Docker commands.

---

# DO NOT HIDE IMPORTANT DETAILS

Especially explain:

* working directory
* staging area
* local repository
* GitHub repository
* runner
* workflow
* job
* step
* artifact
* secret
* environment
* Docker image
* container
* registry
* server
* health check

---

# SAFETY RULES

Never:

* expose real secrets
* hardcode private keys
* recommend committing `.env`
* suggest unsafe `git push --force` for main
* suggest deleting production data casually
* claim free hosting is permanent without verification

For destructive commands add:

⚠️ WARNING

Explain the impact before the command.

---

# FINAL OUTPUT

Return a complete standalone HTML file.

Suggested filename:

`github-cicd-mean-task-manager-lab.html`

Do not return incomplete sections.

Do not use placeholders like:

"Add your own code here"

Instead provide working examples.

Do not say:

"continue from here"

Do not skip failure testing.

The document must be designed so that a developer can follow it from **GitHub repository → CI → CD → deployment → monitoring → rollback** completely from start to finish.
