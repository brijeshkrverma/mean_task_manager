# Branching & Release Flow

Teen long-lived branches. Ye kabhi delete nahi hoti, aur inpe seedhe push
nahi karte — sirf pull request se code aata hai.

| Branch | Environment | Kiske liye | Kitna stable |
|---|---|---|---|
| `develop` | development | Developers | Toot sakti hai, koi baat nahi |
| `staging` | staging | QA / demo / client | Production jaisa hona chahiye |
| `main` | production | Asli users | Hamesha shippable |

## Code ka raasta

```
feature/login-page ─┐
feature/task-filter ├─PR─► develop ─PR─► staging ─PR─► main
fix/token-expiry   ─┘        │            │            │
                             ▼            ▼            ▼
                       dev server   staging server   production
```

Code sirf **neeche se upar** jaata hai. `develop` se `main` me seedhe PR
kabhi nahi — staging skip karne ka matlab hai bina QA ke ship karna.

## Rozana ka kaam

```bash
# 1. Hamesha develop se shuru karo (main se nahi)
git checkout develop
git pull origin develop

# 2. Feature branch banao
git checkout -b feature/task-filter

# 3. Kaam karo, commit karo, push karo
git push -u origin feature/task-filter

# 4. GitHub pe PR kholo:  feature/task-filter ──► develop
#    CI apne aap chalega. Green + 1 approval ke baad merge.
```

Merge hote hi develop ka CI chalta hai, aur green hone par development
server pe deploy ho jaata hai.

## Release nikalna

```bash
# develop me jitna kaam jama hai, wo staging me le jao
# GitHub pe PR:  develop ──► staging
# Merge ke baad staging server pe deploy. QA yahan test karti hai.

# QA se green signal milne par:
# GitHub pe PR:  staging ──► main
# Merge ke baad production deploy.

# Tag lagana mat bhoolna, warna rollback me pata nahi chalega kya tha
git checkout main && git pull origin main
git tag -a v1.2.0 -m "v1.2.0"
git push origin v1.2.0
```

## Hotfix (production toot gaya)

```bash
# main se branch banao, develop se NAHI — develop me untested kaam pada hai
git checkout main && git pull origin main
git checkout -b hotfix/login-500

# fix karo, push karo, PR:  hotfix/login-500 ──► main
```

⚠️ **Merge ke baad wapas neeche back-merge karna ZAROORI hai**, warna wo fix
agle release me gum ho jaayega aur bug dobara aa jaayega:

```bash
git checkout staging && git merge main && git push origin staging
git checkout develop && git merge staging && git push origin develop
```

## Branch naming

| Prefix | Kab | Example |
|---|---|---|
| `feature/` | Naya kaam | `feature/task-filter` |
| `fix/` | Normal bug | `fix/token-expiry` |
| `hotfix/` | Production emergency | `hotfix/login-500` |
| `chore/` | Deps, config, CI | `chore/bump-angular` |

---

# GitHub me ek baar ka setup

Ye workflows tabhi sahi chalenge jab GitHub pe environments, secrets, branch
protection aur default branch set ho jayein.

👉 Poora step-by-step guide (har step ka "kyun" ke saath):
**[GITHUB-SETUP.md](GITHUB-SETUP.md)**

Short me:

1. `staging` aur `develop` branches banao, default branch `develop` karo
2. Teen environments banao — `development`, `staging`, `production`
3. Har environment ke andar wahi 4 secrets daalo (naam same, value alag):
   `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY`
4. `production` pe Required reviewers + Deployment branches = `main`
5. `main`/`staging` pe ruleset: PR required + CI checks required
6. Har server pe repo clone karo, apni-apni branch pe checkout

## Rollback

```bash
# Tareeka 1 (behtar) — galat commit ko ulta karo, phir normal flow
git checkout main && git revert <bad-sha> && git push origin main

# Tareeka 2 (jaldi) — server pe purane commit pe le jao
ssh user@prod-host
cd /srv/mean-task-manager
git reset --hard <last-good-sha>
REMOTE=0 ops/deploy.sh
```

Tareeka 2 ke baad git me revert karna mat bhoolna, warna agla deploy tuta
hua code wapas le aayega.
