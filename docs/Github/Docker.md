Create a complete, beginner-friendly, practical **Docker Learning + Hands-on Deployment Documentation** as a single standalone HTML file.

The learner is a MEAN Stack developer and already has this project:

**Project:** MEAN Task Manager

**Repository:** Mean_Project

**Stack:**

* Angular
* Node.js
* Express.js
* MongoDB
* Redis
* Worker / Background jobs
* Nginx
* GitHub
* GitHub Actions

The goal is to teach Docker from absolute basics to production deployment through this real project.

---

# MAIN GOAL

Do NOT teach Docker as theory only.

Teach Docker by making the learner:

1. Install Docker
2. Understand Docker
3. Create images
4. Create containers
5. Run containers
6. Stop/start containers
7. View logs
8. Debug containers
9. Build Angular image
10. Build Node API image
11. Build Worker image
12. Run MongoDB container
13. Run Redis container
14. Connect containers
15. Create Docker networks
16. Create persistent volumes
17. Create Docker Compose setup
18. Configure environment variables
19. Add health checks
20. Use Nginx
21. Build production images
22. Optimize Dockerfiles
23. Run complete MEAN stack
24. Connect Docker with GitHub Actions
25. Push images to registry
26. Deploy containers on server
27. Monitor containers
28. Break containers intentionally
29. Debug failures
30. Rollback to previous image
31. Understand production best practices

Final target:

```text
Developer
   ↓
Git
   ↓
GitHub
   ↓
GitHub Actions
   ↓
Docker Build
   ↓
Docker Image
   ↓
Container Registry
   ↓
Server
   ↓
Docker Compose
   ↓
Nginx
   ↓
Angular
   ↓
Node.js API
   ↓
Redis
   ↓
Worker
   ↓
MongoDB
```

---

# CRITICAL TEACHING RULE

The learner has difficulty understanding command syntax.

Therefore NEVER just provide:

```bash
docker run ...
```

Instead break it down.

Example:

```bash
docker run -d -p 3000:3000 --name api task-api
```

Explain:

```text
docker
= Docker command-line program

run
= create and start a new container

-d
= detached/background mode

-p
= publish/map a port

3000:3000
= host port : container port

--name
= give the container a name

api
= container name

task-api
= Docker image being used
```

For EVERY important Docker command use this style.

---

# DOCKER INTERNAL MODEL

Explain:

```text
Dockerfile
    ↓
docker build
    ↓
Docker Image
    ↓
docker run
    ↓
Container
```

Also explain:

```text
Container
    ↓
Process
    ↓
Application
```

Explain the difference between:

* Dockerfile
* Image
* Container
* Registry
* Volume
* Network
* Compose
* Host machine

---

# SECTION 1 — WHAT IS DOCKER?

Explain in very simple English:

* What is Docker?
* Why Docker exists
* What problem Docker solves
* Docker vs Virtual Machine
* Container vs VM
* Why developers use Docker
* Why DevOps uses Docker
* Why Docker helps deployment consistency

Use simple example:

```text
Without Docker:

My laptop
   ↓
Works

Server
   ↓
Doesn't work
```

With Docker:

```text
Application
+
Dependencies
+
Runtime
+
Configuration
=
Container
```

---

# SECTION 2 — DOCKER INSTALLATION

Teach Docker Desktop installation on Windows.

Verify:

```bash
docker --version
```

Then:

```bash
docker info
```

Then:

```bash
docker run hello-world
```

Explain:

* What happens
* Image download
* Container creation
* Container execution
* Output

Explain common Windows issues.

---

# SECTION 3 — DOCKER COMMAND STRUCTURE

Create a dedicated Docker syntax lesson.

Explain:

```text
docker <command> <subcommand> <options> <arguments>
```

Examples:

```bash
docker image ls
docker container ls
docker ps
docker build
docker run
docker stop
docker start
docker rm
docker rmi
```

Explain each part.

---

# SECTION 4 — IMAGES

Explain:

* What an image is
* Image layers
* Image ID
* Repository
* Tag
* Version

Teach:

```bash
docker images
docker image ls
```

Explain difference between:

```text
image
container
```

Teach pulling an image:

```bash
docker pull nginx
```

Teach:

```bash
docker pull node:20-alpine
docker pull mongo
docker pull redis
```

Explain why tags matter.

---

# SECTION 5 — FIRST CONTAINER

Use Nginx.

```bash
docker run -d --name my-nginx -p 8080:80 nginx
```

Break command token by token.

Then:

```bash
docker ps
```

Then:

```bash
docker ps -a
```

Then browser:

```text
http://localhost:8080
```

Explain:

```text
localhost:8080
       ↓
host port
       ↓
container port 80
       ↓
Nginx
```

---

# SECTION 6 — CONTAINER LIFECYCLE

Teach:

```bash
docker start
docker stop
docker restart
docker pause
docker unpause
docker kill
docker rm
```

For every command explain:

* What it does
* What changes
* When to use it
* Safe/unsafe
* Verification

Create lifecycle diagram:

```text
Created
  ↓
Running
  ↓
Stopped
  ↓
Removed
```

---

# SECTION 7 — LOGS AND DEBUGGING

Teach:

```bash
docker logs container-name
docker logs -f container-name
```

Explain:

* `-f`
* stdout/stderr
* why logs matter

Also:

```bash
docker inspect container-name
```

and:

```bash
docker stats
```

and:

```bash
docker exec -it container-name sh
```

Explain:

* What `exec` means
* What `-it` means
* Why `sh` is used
* How to enter a running container

---

# SECTION 8 — DOCKERFILE

Create first Dockerfile.

For Node.js API:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

Explain EVERY line.

Especially explain:

* FROM
* WORKDIR
* COPY
* RUN
* EXPOSE
* CMD

Also explain:

```text
COPY package*.json
```

Why dependencies are copied before source code.

---

# SECTION 9 — BUILD IMAGE

Teach:

```bash
docker build -t task-api:1.0.0 ./api
```

Break:

```text
docker
build
-t
task-api:1.0.0
./api
```

Explain:

* build context
* image name
* tag
* Docker build layers

Verify:

```bash
docker images
```

---

# SECTION 10 — RUN NODE API

Run:

```bash
docker run -d \
  --name task-api \
  -p 3000:3000 \
  task-api:1.0.0
```

Then:

```bash
docker ps
```

Health:

```text
http://localhost:3000/api/health
```

Explain full request path.

---

# SECTION 11 — ENVIRONMENT VARIABLES

Teach:

```bash
docker run -e NODE_ENV=production ...
```

Also:

```bash
docker run --env-file .env ...
```

Explain:

* environment variables
* `.env`
* why secrets must not be inside Dockerfile
* why secrets must not be committed to Git

Teach:

```text
.env
.env.example
```

Use examples:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=...
REDIS_URL=...
JWT_SECRET=...
```

Never use real credentials.

---

# SECTION 12 — .dockerignore

Create:

```text
.dockerignore
```

Example:

```text
node_modules
.git
.gitignore
.env
dist
coverage
npm-debug.log
Dockerfile
docker-compose.yml
```

Explain why `.dockerignore` matters.

---

# SECTION 13 — ANGULAR PRODUCTION IMAGE

Create multi-stage Dockerfile.

Example:

```dockerfile
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build -- --configuration production

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

IMPORTANT:

Angular output paths can differ depending on project configuration.

Teach how to check the actual generated `dist/` structure and modify the COPY path accordingly.

Explain multi-stage builds:

```text
Node image
   ↓
Angular build
   ↓
Build output
   ↓
Nginx image
```

Explain why final production image does not need Node development dependencies.

---

# SECTION 14 — MONGODB CONTAINER

Teach:

```bash
docker run -d \
  --name task-mongodb \
  -p 27017:27017 \
  mongo
```

Explain:

* MongoDB container
* database files
* why persistence is needed

Then introduce volumes.

---

# SECTION 15 — DOCKER VOLUMES

Teach:

```bash
docker volume create mongo_data
```

Then:

```bash
docker run -d \
  --name task-mongodb \
  -v mongo_data:/data/db \
  mongo
```

Explain:

```text
Container deleted
      ↓
Data survives
      ↓
Volume
```

Teach:

```bash
docker volume ls
docker volume inspect mongo_data
docker volume rm mongo_data
```

Clearly mark destructive commands.

---

# SECTION 16 — DOCKER NETWORKS

Teach:

```bash
docker network create task-network
```

Attach:

```bash
docker run -d --network task-network ...
```

Explain:

```text
api
 ↓
MongoDB
 ↓
Redis
```

Very important:

Explain that containers communicate using **container/service names**, not `localhost`.

Example:

Correct:

```text
mongodb://task-mongodb:27017/task_manager
```

Incorrect inside API container:

```text
mongodb://localhost:27017/task_manager
```

Explain why.

---

# SECTION 17 — REDIS CONTAINER

Teach:

```bash
docker run -d \
  --name task-redis \
  --network task-network \
  redis
```

Explain Redis connection:

```env
REDIS_URL=redis://task-redis:6379
```

---

# SECTION 18 — WORKER CONTAINER

Create worker Dockerfile.

Teach:

```text
Worker
 ↓
Redis
 ↓
MongoDB
```

Explain why worker should be a separate container/process.

---

# SECTION 19 — DOCKER COMPOSE

Explain why manually starting 5–6 containers is inconvenient.

Introduce:

```text
docker-compose.yml
```

or:

```text
compose.yaml
```

Prefer current Docker Compose conventions.

Create complete example:

```yaml
services:

  web:
    build: ./web
    ports:
      - "80:80"
    depends_on:
      - api

  api:
    build: ./api
    environment:
      MONGODB_URI: mongodb://mongodb:27017/task_manager
      REDIS_URL: redis://redis:6379
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
      - redis

  worker:
    build: ./worker
    environment:
      MONGODB_URI: mongodb://mongodb:27017/task_manager
      REDIS_URL: redis://redis:6379
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis

volumes:
  mongo_data:
```

Do not blindly assume compatibility with every project.

Explain each service.

---

# SECTION 20 — COMPOSE COMMANDS

Teach:

```bash
docker compose up
docker compose up -d
docker compose up --build
docker compose down
docker compose ps
docker compose logs
docker compose logs -f
docker compose restart
docker compose pull
```

Explain every command and every important flag.

---

# SECTION 21 — HEALTHCHECK

Add Docker health checks.

Example API:

```dockerfile
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
```

If the chosen base image does not include `wget`, provide an appropriate alternative or install the minimum required utility.

Teach:

```bash
docker inspect --format='{{json .State.Health}}' task-api
```

Explain:

* health check
* healthy
* unhealthy
* starting

---

# SECTION 22 — DEPENDENCIES AND STARTUP ORDER

Explain why:

```yaml
depends_on:
```

does NOT automatically guarantee that a database is ready to accept connections.

Teach health checks and application retry logic.

Show:

```text
Container started
≠
Application ready
```

This is an important production lesson.

---

# SECTION 23 — NGINX

Use Nginx as reverse proxy.

Architecture:

```text
Internet
   ↓
Nginx
 ├── /        → Angular
 └── /api     → Node.js
```

Teach:

* reverse proxy
* static files
* proxy_pass
* client request
* upstream

Create example config.

---

# SECTION 24 — COMPLETE LOCAL MEAN DOCKER STACK

Final local architecture:

```text
Browser
   ↓
Nginx
   ├── Angular
   └── /api
        ↓
      Node API
       ├── MongoDB
       └── Redis
             ↓
           Worker
```

Create complete Compose configuration.

The learner must run:

```bash
docker compose up -d --build
```

Then verify:

```bash
docker compose ps
docker compose logs
```

---

# SECTION 25 — TEST THE COMPLETE APPLICATION

Teach:

1. Open frontend
2. Login
3. Create task
4. Update task
5. Delete task
6. Trigger worker job
7. Check MongoDB data
8. Check Redis
9. Check API health
10. Check Docker logs

Create a verification checklist.

---

# SECTION 26 — DOCKER IMAGE OPTIMIZATION

Teach:

* smaller base images
* multi-stage builds
* dependency caching
* `.dockerignore`
* non-root user
* production dependencies only
* avoid unnecessary packages
* image tagging

Explain:

```text
Huge image
↓
slow pull
↓
slow deployment

Smaller image
↓
fast pull
↓
fast deployment
```

---

# SECTION 27 — NON-ROOT CONTAINER

Teach why applications should not run as root where practical.

Example:

```dockerfile
USER node
```

Explain when this works and when ownership/permissions need adjustment.

---

# SECTION 28 — IMAGE TAGGING STRATEGY

Teach:

Bad:

```text
latest
```

Better:

```text
task-api:1.0.0
task-api:1.1.0
```

Production-friendly:

```text
task-api:<git-sha>
```

Explain why immutable identifiers help rollback.

---

# SECTION 29 — DOCKER REGISTRY

Explain container registry.

Examples:

* GitHub Container Registry
* Docker Hub
* Other private registries

Use GHCR for the practical project where suitable.

Flow:

```text
GitHub Actions
      ↓
docker build
      ↓
docker tag
      ↓
docker push
      ↓
GHCR
```

---

# SECTION 30 — DOCKER + GITHUB ACTIONS

Create workflow:

```text
Pull Request
   ↓
CI
   ├── npm ci
   ├── test
   ├── build Angular
   ├── build API
   └── docker build
```

Then:

```text
main
 ↓
CD
 ↓
Docker build
 ↓
GHCR
 ↓
Server deploy
```

Explain exactly where Docker fits inside CI/CD.

---

# SECTION 31 — DOCKER IMAGE SECURITY

Teach:

* No secrets inside image
* No API keys in Dockerfile
* No `.env` inside image
* Scan images
* Minimal base image
* Non-root
* Pin important versions where appropriate

Introduce tools conceptually:

* Trivy
* Docker Scout
* Grype

Do not require paid tools.

---

# SECTION 32 — CONTAINER SECURITY LAB

Intentionally create:

1. Secret inside Dockerfile
2. Running as root
3. Huge unnecessary image
4. Exposed unnecessary port

Then fix each one.

Explain the security impact.

---

# SECTION 33 — STORAGE AND BACKUP

Explain:

```text
Container = replaceable
Volume = persistent data
```

Teach MongoDB backup concept.

Use:

```text
mongodump
```

and explain:

```text
Database
 ↓
Backup
 ↓
External storage
```

Do not claim a Docker volume alone is a backup.

---

# SECTION 34 — MONITORING

Teach:

```bash
docker ps
docker stats
docker logs
docker inspect
docker compose ps
```

Explain:

* CPU
* memory
* restarts
* health
* logs

Then introduce:

* Prometheus
* Grafana
* Loki

as future enhancements.

---

# SECTION 35 — FAILURE LAB

Intentionally break the system.

### Failure 1

Stop MongoDB.

Expected:

API errors.

Teach diagnosis.

### Failure 2

Stop Redis.

Expected:

worker/cache failures.

### Failure 3

Stop API.

Expected:

Nginx 502 or API unavailable.

### Failure 4

Wrong environment variable.

Expected:

startup/runtime failure.

### Failure 5

Wrong Docker image tag.

Expected:

deployment failure.

### Failure 6

Remove a container.

Teach why volume data remains.

### Failure 7

Remove volume.

Clearly warn that data may be permanently deleted.

Teach recovery.

---

# SECTION 36 — DEBUGGING METHOD

Teach a deterministic debugging flow:

```text
1. Is container running?
2. Is container healthy?
3. Check logs
4. Check environment variables
5. Check ports
6. Check network
7. Check DNS/service name
8. Check dependencies
9. Reproduce locally
10. Fix
11. Verify
```

Do not jump randomly between commands.

---

# SECTION 37 — COMMON DOCKER ERRORS

Create detailed troubleshooting sections for:

1. Port is already allocated
2. Container name already in use
3. Image not found
4. Cannot connect to Docker daemon
5. Permission denied
6. Container exits immediately
7. CrashLoop behavior
8. Connection refused
9. MongoDB connection failure
10. Redis connection failure
11. Nginx 502
12. Docker build fails
13. npm ci fails
14. Disk full
15. Wrong architecture/image
16. Health check failing
17. Container cannot resolve service name

For every error:

* Error message
* Simple meaning
* Why it happens
* Diagnostic command
* Fix
* Verification

---

# SECTION 38 — ROLLBACK

Teach real production rollback.

Example:

```text
task-api:a12b45c  = working
task-api:f76d831  = broken
```

Flow:

```text
Working version
      ↓
Broken deployment
      ↓
Health check fails
      ↓
Rollback
      ↓
Previous image
      ↓
Health check passes
```

Explain:

* Git rollback
* image rollback
* application rollback
* database rollback

Important:

Never claim that rolling back an application automatically rolls back database migrations.

---

# SECTION 39 — PRODUCTION DEPLOYMENT

Teach deployment on a Linux server.

Flow:

```text
GitHub
 ↓
GitHub Actions
 ↓
GHCR
 ↓
Server
 ↓
docker compose pull
 ↓
docker compose up -d
 ↓
health check
 ↓
smoke test
```

Explain:

* SSH
* server
* registry login
* image pull
* Compose
* Nginx
* HTTPS

---

# SECTION 40 — FREE TESTING ENVIRONMENT

When discussing hosting:

Clearly distinguish:

* Free
* Free tier
* Trial
* Paid

Never claim a service is permanently free without current verification.

If no reliable free VPS is available:

Use:

* Windows + Docker Desktop
* WSL
* Linux VM
* Local server

The goal is to learn Docker correctly before paying for infrastructure.

---

# SECTION 41 — DOCKER COMMAND CHEAT SHEET

Create a detailed table:

| Command | Meaning | What changes | Safe? |
| ------- | ------- | ------------ | ----- |

Include:

```bash
docker --version
docker info
docker pull
docker build
docker images
docker image ls
docker run
docker ps
docker ps -a
docker start
docker stop
docker restart
docker kill
docker rm
docker rmi
docker logs
docker exec
docker inspect
docker stats
docker network ls
docker network create
docker volume ls
docker volume create
docker volume inspect
docker volume rm
docker compose up
docker compose down
docker compose build
docker compose logs
docker compose ps
docker compose pull
docker compose restart
```

---

# SECTION 42 — COMMAND SYMBOL EXPLANATION

Create dedicated section explaining:

```text
-
--
:
.
..
/
=
>
<
```

Examples:

```bash
docker run -d
docker run --name api
task-api:1.0.0
./api
3000:3000
```

Explain exactly what each symbol/format means.

---

# SECTION 43 — PRACTICAL EXERCISES

Create exercises:

### Level 1

Run hello-world.

### Level 2

Run Nginx.

### Level 3

Stop/start container.

### Level 4

Read logs.

### Level 5

Enter container.

### Level 6

Build Node image.

### Level 7

Run Node API.

### Level 8

Build Angular image.

### Level 9

Run MongoDB.

### Level 10

Add volume.

### Level 11

Create network.

### Level 12

Add Redis.

### Level 13

Add worker.

### Level 14

Create Compose.

### Level 15

Add health checks.

### Level 16

Add Nginx.

### Level 17

Run complete MEAN stack.

### Level 18

Push image to GHCR.

### Level 19

Deploy to server.

### Level 20

Break deployment and rollback.

For every exercise include:

* Goal
* Command
* Command breakdown
* Expected result
* Verification
* Common mistake
* Success condition

---

# SECTION 44 — FINAL MEAN PROJECT LAB

The learner must containerize this exact structure:

```text
mean-task-manager/
│
├── web/
├── api/
├── worker/
├── nginx/
├── ops/
├── .github/
├── docker-compose.yml
├── .dockerignore
└── README.md
```

Final containers:

```text
web
api
worker
mongodb
redis
nginx
```

Final architecture:

```text
                    Internet
                       ↓
                     Nginx
                    /     \
                   /       \
              Angular      /api
                             ↓
                           Node API
                         /          \
                    MongoDB        Redis
                                     ↓
                                   Worker
```

---

# SECTION 45 — FINAL EXAM

Learner must perform without blindly copying:

1. Pull latest code
2. Create feature branch
3. Modify Dockerfile
4. Build image
5. Run container
6. Check logs
7. Check health
8. Debug failure
9. Create Compose stack
10. Add MongoDB
11. Add Redis
12. Add worker
13. Add Nginx
14. Build complete stack
15. Push image to GHCR
16. Deploy server
17. Monitor
18. Intentionally break service
19. Diagnose
20. Rollback
21. Verify recovery

Give score:

```text
Docker Basics       __ / 100
Images              __ / 100
Containers          __ / 100
Networking          __ / 100
Volumes             __ / 100
Compose             __ / 100
Security            __ / 100
Debugging           __ / 100
CI/CD Integration   __ / 100
Deployment          __ / 100
Rollback            __ / 100
```

---

# FINAL PRODUCTION CHECKLIST

Include:

```text
[ ] Docker installed
[ ] Docker commands understood
[ ] Dockerfile understood
[ ] Image built
[ ] Container run
[ ] Logs understood
[ ] Networking understood
[ ] Volumes understood
[ ] Compose working
[ ] MongoDB persistent
[ ] Redis working
[ ] Worker working
[ ] Nginx working
[ ] Health checks working
[ ] Images optimized
[ ] Security basics implemented
[ ] GHCR working
[ ] GitHub Actions builds image
[ ] Server deployment working
[ ] Monitoring working
[ ] Failure testing completed
[ ] Rollback tested
```

---

# HTML REQUIREMENTS

Create ONE complete standalone HTML file.

No external frameworks.

No CDN dependency.

No external JavaScript library.

Use:

* HTML
* CSS
* Vanilla JavaScript

Must work offline.

Use professional DevOps dashboard design.

Color palette:

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

* Left sidebar
* Search
* Table of contents
* Chapter navigation
* Step navigation
* Progress percentage
* Completion checkbox
* Previous/Next buttons
* Copy command button
* Expand/collapse
* Command breakdown UI
* Expected output cards
* Warning boxes
* Error boxes
* Success boxes
* Architecture diagrams
* Troubleshooting tables
* Practical lab sections
* Final exam
* LocalStorage progress

---

# SPECIAL COMMAND BREAKDOWN COMPONENT

For every important command render something like:

```text
COMMAND

docker run -d --name api -p 3000:3000 task-api:1.0.0
```

Then:

```text
docker
→ Docker CLI

run
→ create/start container

-d
→ detached mode

--name
→ container name option

api
→ container name

-p
→ port mapping

3000:3000
→ host : container

task-api:1.0.0
→ image:tag
```

Also show:

```text
BEFORE

Docker Image
     ↓
(no container)

AFTER

Docker Image
     ↓
Container
     ↓
Running Application
```

And:

```text
NOT DONE:

❌ Not deployed to production
❌ Not automatically pushed to registry
❌ Not automatically in GitHub
```

---

# LEARNING METHOD

Every section must follow:

```text
Understand
    ↓
Command
    ↓
Command breakdown
    ↓
Run
    ↓
Expected output
    ↓
Verify
    ↓
Break intentionally
    ↓
Fix
    ↓
Complete
```

Do not allow the learner to blindly copy commands.

---

# IMPORTANT SAFETY

Clearly mark destructive commands such as:

```bash
docker rm
docker rmi
docker volume rm
docker system prune
docker compose down -v
```

Explain exactly what data may be removed.

Especially:

```bash
docker system prune -a
```

and:

```bash
docker compose down -v
```

must have strong warnings.

Never use these casually.

---

# FINAL OUTPUT

Return ONLY the complete HTML document.

Suggested filename:

`docker-mean-task-manager-practical-guide.html`

Do not return incomplete HTML.

Do not skip sections.

Do not use TODO placeholders.

Do not say "continue later".

The final document must allow the learner to go from:

**Docker Beginner → MEAN Containerization → Docker Compose → CI/CD → Registry → Server Deployment → Monitoring → Failure Testing → Rollback → Production Docker**
without needing another Docker tutorial.
