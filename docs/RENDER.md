# Render pe deploy — step by step

Dashboard pe jo message aaya tha —

> _"PR Previews and Auto-Deploy are available only for repositories
> configured with Blueprints"_

— uska matlab ye tha ki **New Web Service** wizard se manually service banane
par ye features nahi milte. Iske liye repo root me `render.yaml` chahiye.
Wo file ab bani hui hai: [`render.yaml`](../render.yaml).

> Note: **PR Previews** ke liye paid workspace bhi chahiye (neeche dekhein).
> **Auto-Deploy** free Hobby workspace pe bhi kaam karta hai.

---

## Pehle ye samajh lein

### Kya-kya banega

| Service | Type | Plan | Kaam |
|---|---|---|---|
| `mtm-keyvalue` | Key Value | **free** | BullMQ ka queue (Redis-compatible) |
| `mtm-api` | Web (Docker) | **free** | Express backend |
| `mtm-web` | Static site | **free** | Angular frontend |
| ~~`mtm-worker`~~ | Worker | ~~$7/mo~~ | **Abhi band hai** — `render.yaml` me commented |

**Total kharcha: $0/mo.**

Worker jaan-boojh kar band rakha hai kyunki Render pe background workers ka
free plan hota hi nahi. Iska matlab: API queue me jobs daalti rahegi par
unhe uthane wala koi nahi hoga. Login, task CRUD — app ka baaki sab normal
chalega. Chaalu karna ho to `render.yaml` me `mtm-worker` block uncomment
karein (steps wahin comment me likhe hain).

### Teen cheezein jo pehle se pata honi chahiye

**1. MongoDB Render pe nahi milta.** Render ke paas Postgres aur Key Value
hain, Mongo nahi. Aapka poora app Mongoose pe hai, to Mongo bahar se lena
padega — hum **MongoDB Atlas** ka free M0 cluster use karenge (Step 1).

**2. Background worker free nahi hai.** Render pe free instances sirf web
services, static sites, Postgres aur Key Value ko milte hain. Worker paid
hai (~$7/mo) — **isiliye wo abhi `render.yaml` me commented hai** aur poora
setup $0 pe chal raha hai.

**3. Free plan ki do limits jo aapko dikhengi:**
- Free **web service 15 minute** bina traffic ke **so jaati hai**. Agli
  request pe jaagne me ~30-50 second lagte hain. Demo me pehli click slow
  lagegi — ye normal hai, kharaabi nahi.
- Free **Key Value in-memory only** hai. Restart pe queue khali. Dev ke liye
  theek, production me paid plan chahiye.

Static site kabhi nahi soti, to frontend hamesha turant khulega.

---

## Step 1 — MongoDB Atlas (free)

1. [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) pe account banayein
2. **Build a Database** ▸ **M0 FREE** chunein
3. Region: **Mumbai (ap-south-1)** ya **Singapore** — Render ke `singapore`
   region ke paas
4. **Database Access** ▸ **Add New Database User**
   - Username: `mtm-app`, password **Autogenerate** karke **copy kar lein**
   - Role: `Read and write to any database`
5. **Network Access** ▸ **Add IP Address** ▸ **Allow access from anywhere**
   (`0.0.0.0/0`)

   > Render free services ka outbound IP fix nahi hota, isliye ye zaroori
   > hai. Security username+password se aa rahi hai. Paid plan pe static
   > outbound IPs milte hain, tab is list ko tight kar sakte hain.

6. **Database** ▸ **Connect** ▸ **Drivers** ▸ connection string copy karein:

   ```
   mongodb+srv://mtm-app:<password>@cluster0.xxxxx.mongodb.net/task_manager?retryWrites=true&w=majority
   ```

   `<password>` ki jagah asli password daalein, aur `/` ke baad
   **`task_manager`** database ka naam zaroor likhein — warna app `test`
   database me likhne lagega.

   > 🔴 **Ye string kabhi bhi kisi tracked file me mat daalna** —
   > `.env.example`, `docker-compose.yml`, `render.yaml` me nahi. Repo public
   > hai, matlab commit hote hi wo string duniya ko dikh jaayegi (aur bots
   > GitHub ko lagataar scan karte hain).
   > Iski jagah sirf do hain: local `.env` (gitignored) aur Render dashboard.

Is string ko sambhal kar rakhein, Step 4 me chahiye.

---

## Step 2 — Code push karein

Render `render.yaml` repo se hi padhta hai, to wo pehle GitHub pe hona chahiye.

```bash
git add render.yaml docs/ .github/ .gitignore api/ web/ worker/
git commit -m "chore: add Render blueprint and CI/CD docs"
git push origin staging
```

---

## Step 3 — Blueprint banayein

1. [dashboard.render.com](https://dashboard.render.com) ▸ **New +** ▸ **Blueprint**

   > ⚠️ **New Web Service** wale wizard pe wapas mat jaayein — wahi galti
   > thi jisse wo message aaya tha. Blueprint alag option hai.

2. GitHub connect karein, `mean_task_manager` repo chunein
3. Branch **`staging`** chunein (render.yaml wahi hai). Render **teen services** dikhayega — verify karein
4. **Apply**

Pehla deploy 5-10 minute lega (Docker images ban rahi hain). `mtm-api` is
waqt **fail hogi** — MONGO_URI abhi set nahi hai. Ye expected hai.

---

## Step 4 — Secrets bharein

`render.yaml` me `MONGO_URI` pe `sync: false` likha hai — matlab uski value
jaan-boojh kar file me **nahi** rakhi, kyunki wo public repo me hai aur usme
password hota hai. Wo dashboard se bharni hoti hai.

**`mtm-api` ▸ Environment ▸ `MONGO_URI`** ▸ Step 1 wali string paste ▸ **Save**

Bas itna hi — worker abhi commented hai, to sirf ek jagah daalni hai.

> Jab kabhi worker chaalu karein, uska `MONGO_URI` bhi alag se bharna padega
> — `sync: false` wale secrets services ke beech share nahi hote. Value
> **exactly same** honi chahiye, warna worker doosre database me jhaankta
> rahega aur koi error bhi nahi aayega. Ye debug karne me sabse painful bug hai.

`JWT_SECRET` aapko nahi bharna — `generateValue: true` ki wajah se Render ne
khud strong random value bana di hai. `REDIS_URL` bhi apne aap bhara hua hai,
upar wali `mtm-keyvalue` service se.

Save karte hi service redeploy hogi. Ab `mtm-api` green honi chahiye.

---

## Step 5 — API check karein

`mtm-api` ka URL kholein (dashboard me upar dikhta hai):

```
https://mtm-api-xxxx.onrender.com/health/ready
```

Ye milna chahiye:

```json
{ "status": "ok", "checks": { "mongo": true, "redis": true }, "version": "dev" }
```

`mongo: false` → MONGO_URI galat hai, ya Atlas ki Network Access list me
`0.0.0.0/0` nahi hai.
`redis: false` → Key Value service abhi ban rahi hai, 1 minute ruk kar dobara.

---

## Step 6 — 🔴 API ka URL `render.yaml` me theek karein

**Ye step skip mat karna, warna frontend se koi API call kaam nahi karegi.**

Render service ke naam ke saath random suffix laga deta hai agar wo naam
pehle se kisi ne le rakha ho. `render.yaml` me abhi `https://mtm-api.onrender.com`
likha hai, jo shayad aapka asli URL na ho.

1. `mtm-api` ka **asli** URL dashboard se copy karein
2. [`render.yaml`](../render.yaml) me **dono** rewrite rules me wo URL daalein:

   ```yaml
   - type: rewrite
     source: /api/*
     destination: https://mtm-api-xxxx.onrender.com/api/*   # ← apna URL

   - type: rewrite
     source: /health/*
     destination: https://mtm-api-xxxx.onrender.com/health/*  # ← apna URL
   ```

3. Commit + push. Render apne aap update kar lega.

### Ye rewrite hai kya, aur kyun chahiye?

Angular code same-origin path call karta hai —
[`task.service.ts`](../web/src/app/tasks/task.service.ts) me `'/api/tasks'`
likha hai, poora URL nahi. Local pe nginx ise backend pe bhej deta hai
([nginx/sites-enabled/web.conf](../nginx/sites-enabled/web.conf)).

Render pe nginx nahi hai (static site hai), to wahi kaam ye rewrite rule
karta hai. Fayda: browser ke liye sab kuch **ek hi domain** pe rehta hai —
CORS ka jhanjhat hi nahi aata.

⚠️ `render.yaml` me `/*` wala catch-all rule **sabse aakhir me** hai, aur
wahi rehna chahiye. Rules upar se neeche match hote hain — wo upar chala
gaya to `/api/tasks` bhi `index.html` return karega aur poori app tut
jaayegi (aur error message bilkul samajh nahi aayega — JSON ki jagah HTML).

---

## Step 7 — App kholein

`mtm-web` ka URL kholein. Register ▸ login ▸ task banayein.

Pehli API call slow lag sakti hai (free API service so gayi thi) — 30-50
second. Uske baad normal.

---

## PR Previews — abhi available nahi

[`render.yaml`](../render.yaml) me `previews` block **commented** hai, aur wo
jaan-boojh kar hai.

Render ne Blueprint apply karte waqt ye error diya tha:

> _Preview Environments are not available for Hobby workspaces_

Preview Environments **paid (Professional) workspace** ka feature hai. Free
Hobby workspace pe wo block rakhne se Blueprint hi reject ho jaata hai.

**Kaam kya karta:** har PR pe Render saari services ka ek alag copy bana deta,
apne alag URL pe — reviewer ko code padhne ke bajaye chalta hua app milta.
PR merge/close hote hi sab delete.

**Chaalu kaise karein:** workspace paid karne ke baad
[`render.yaml`](../render.yaml) me `previews` wali teen line uncomment kar
dein. Aur kuch nahi badalna.

**Tab tak review kaise karein:** [`ci.yml`](../.github/workflows/ci.yml)
har PR pe chalta hai, to code green hai ya nahi wo pata chalta rehta hai —
bas chalta hua app dekhne ko nahi milega.

---

## Auto-Deploy — CI ke saath jodhna

Har service pe `autoDeployTrigger: checksPass` laga hai. Iska matlab:

```
push ──► GitHub Actions CI chalti hai ──► sab green? ──► Render deploy karta hai
                                     └──► koi red? ──► Render kuch nahi karta
```

Ye `commit` (turant deploy) se behtar hai — tuta hua code kabhi live nahi
jaata. Aur ye aapke [`ci.yml`](../.github/workflows/ci.yml) ke saath perfectly
fit baithta hai.

> Iske sahi chalne ke liye GitHub pe Render ka access hona chahiye (Blueprint
> connect karte waqt mil jaata hai). Agar deploy trigger hi na ho, to
> `mtm-api` ▸ Settings ▸ Build & Deploy me dekh lein ki "After CI Checks
> Pass" chuna hua hai.

---

## Teen branch wala flow (`docs/BRANCHING.md`) Render ke saath

`render.yaml` ki services **ek hi branch** se juddti hain — by default aapki
default branch (`develop`). Teen alag environments chahiye to do tareeke hain:

**Tareeka 1 — PR previews hi kaafi hain (recommended, free)**
`develop` pe Blueprint chalao, aur har PR ka apna preview environment mil
jaata hai. Chhoti team ke liye alag staging server ki zaroorat hi nahi padti.

**Tareeka 2 — alag Blueprint per branch (paid)**
Render me alag **workspace/environment** banakar wahi repo `staging` aur
`main` branch se connect karein. Services ke naam alag rakhne padenge
(`mtm-api-staging` etc.), warna clash hoga.

Abhi Tareeka 1 se shuru karein. Zaroorat padne par Tareeka 2 pe jaana aasaan
hai.

---

## GitHub Actions ka `deploy.yml` ab kya karega?

Kuch nahi — uska automatic trigger **band kar diya gaya hai**.

Wo workflow SSH se aapke apne VPS pe deploy karta hai. Render khud git se
deploy karta hai, to wo raasta abhi chahiye nahi. Trigger chaalu rehta to
har push pe fail hota (DEPLOY_HOST/DEPLOY_SSH_KEY secrets hain hi nahi), aur
roz-roz red ❌ dekhne se aadmi red ko ignore karna seekh jaata hai.

File delete nahi ki — kal aap VPS pe shift ho sakte hain. Tab
[`deploy.yml`](../.github/workflows/deploy.yml) me `workflow_run` wala
commented block wapas uncomment kar dein aur
[`GITHUB-SETUP.md`](GITHUB-SETUP.md) follow karein.

---

## Kuch galat ho to

| Problem | Wajah |
|---|---|
| `mtm-api` deploy fail, health check timeout | MONGO_URI galat/khali. `/health/ready` 503 de raha hai — Render sahi kar raha hai, wo tuta hua version live nahi hone de raha |
| `mongo: false` | Atlas Network Access me `0.0.0.0/0` nahi hai, ya password me special character URL-encode nahi hua |
| Frontend khulta hai par login pe error | Step 6 nahi kiya — rewrite me galat API URL |
| API se JSON ki jagah HTML aa raha hai | `/*` wala route upar chala gaya hai. Wo hamesha sabse aakhir me |
| Pehli request 40 second leti hai | Free service so gayi thi. Normal hai |
| Worker deploy nahi ho raha | Worker free plan pe nahi chalta, paid plan chahiye |
| Jobs process nahi ho rahe | Worker block comment kiya hua hai, ya uska MONGO_URI api se alag hai |

---

## Related

- [`render.yaml`](../render.yaml) — Blueprint, line-by-line commented
- [BRANCHING.md](BRANCHING.md) — git flow
- [GITHUB-SETUP.md](GITHUB-SETUP.md) — VPS wala raasta (abhi zaroori nahi)
- [`ci.yml`](../.github/workflows/ci.yml) — CI, line-by-line commented
