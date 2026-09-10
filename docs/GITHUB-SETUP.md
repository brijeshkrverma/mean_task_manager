# GitHub Setup — step by step, sawaal ke jawab ke saath

Ye ek-baar ka setup hai. Iske bina `.github/workflows/ci.yml` aur
`deploy.yml` sahi nahi chalenge.

Har step me pehle **"kyun"** likha hai, phir **"kaise"**. Kyunki click karna
aasaan hai — samajhna ki wo click kyun kar rahe ho, wahi asli cheez hai.

> **Aapke repo ke liye ye sab free hai.** `brijeshkrverma/mean_task_manager`
> public hai aur personal account pe hai. GitHub pe Environments, environment
> protection rules (required reviewers), aur branch protection — ye sab
> public repos pe free plan me milte hain. Private repo pe hote to
> Environments ke protection rules ke liye Pro/Team plan chahiye hota.

---

# Part 1 — Teen environments

## Sawaal: Environment hota kya hai?

GitHub me "Environment" ek **deploy target ka naam** hai — matlab ek jagah
jahan aapka code chalta hai. Ye koi server nahi banata; ye sirf GitHub ke
andar ek **labelled dabba** hai jisme us jagah se judi cheezein rakhi jaati
hain:

- us server ke **secrets** (IP, SSH key)
- us server ke **rules** (kaun approve karega, kaunsi branch deploy kar sakti hai)
- us server ki **deploy history** (kab, kisne, kaunsa commit)

## Sawaal: 3 environments kyun? Ek se kaam nahi chalta?

Ek se chal to jaata hai — jab tak ek din nahi chalta. Problem ye hai:

Agar ek hi server hai, to har `develop` merge seedha **asli users** ke saamne
chala jaata hai. Aapka aadha-adhoora feature, aapka debug `console.log`,
aapka toota hua migration — sab live. Test karne ke liye koi jagah hi nahi
bachti.

Teen environments ka asli fayda ye hai ki har code change ko **do baar chance**
milta hai pakde jaane ka, users tak pahunchne se pehle:

| # | Environment | Kaun use karta hai | Toot jaye to kya hota hai |
|---|---|---|---|
| 1 | **development** | Developers khud | Kuch nahi. Bilkul normal hai. |
| 2 | **staging** | QA, client demo | Release ruk jaata hai. Users ko pata nahi chalta. |
| 3 | **production** | Asli users | 🔥 Paisa aur bharosa dono jaata hai. |

Bug environment 1 me mila → 5 minute ka kaam.
Bug environment 3 me mila → hotfix, rollback, client ka phone, raat ki neend.

Yahi wajah hai ki har professional team kam se kam 2 (dev + prod), aur zyada
tar 3 environments rakhti hai.

## Sawaal: Teeno ka naam kya hoga?

**Exactly ye teen naam** — lowercase, spelling bilkul same:

```
development
staging
production
```

⚠️ **Naam badalna mat.** Ye naam `deploy.yml` ki `resolve` job me hardcoded
hain. Agar aapne GitHub pe `prod` banaya aur workflow `production` maang raha
hai, to deploy fail hoga — aur error message confusing hoga ("environment not
found" nahi, balki secrets khali milenge).

Mapping jo `deploy.yml` follow karta hai:

| Branch | ──► | Environment |
|---|---|---|
| `develop` | ──► | `development` |
| `staging` | ──► | `staging` |
| `main` | ──► | `production` |

> Dhyan dein: branch `develop` hai par environment `development` hai — ye
> dono naam alag hain. Isi mapping ko sambhalne ke liye `deploy.yml` me
> `resolve` job banayi gayi hai.

## Kaise banayein

1. Browser me repo kholein: `https://github.com/brijeshkrverma/mean_task_manager`
2. Upar ki row me **Settings** tab (⚙️ icon, sabse right me)
3. Left sidebar me neeche scroll karein → **Environments**
4. Right me green button **New environment**
5. Naam type karein: `development` → **Configure environment**
6. Ye do baar aur repeat karein: `staging`, `production`

Ab teen environments dikhne chahiye. Abhi ye khaali hain — secrets Part 2 me
aayenge.

---

# Part 2 — Chaar secrets

## Sawaal: Ye 4 secrets kyun? Har ek ka kaam kya hai?

Deploy asal me ye karta hai: GitHub ka runner **SSH se aapke server me
ghusta hai** aur wahan `ops/deploy.sh` chalata hai. SSH se kisi machine me
ghusne ke liye chaar cheezein chahiye — bas wahi chaar secrets hain:

```bash
ssh  -i <DEPLOY_SSH_KEY>  <DEPLOY_USER>@<DEPLOY_HOST>  "cd <DEPLOY_PATH> && ..."
        └── chaabi          └── kaun      └── kahan        └── kis folder me
```

| Secret | Kya hai | Example value | Ye secret kyun hai? |
|---|---|---|---|
| `DEPLOY_HOST` | Server ka IP ya domain | `203.0.113.45` | Aapke server ka pata public karna attackers ko target de dena hai |
| `DEPLOY_USER` | SSH username | `deploy` | Username + host mil kar aadha brute-force kaam aasaan kar dete hain |
| `DEPLOY_PATH` | Server pe repo ka folder | `/srv/mean-task-manager` | Server ka andar ka structure batana zaroori nahi |
| `DEPLOY_SSH_KEY` | Private SSH key, poori file | `-----BEGIN OPENSSH PRIVATE KEY-----`<br>`...`<br>`-----END OPENSSH PRIVATE KEY-----` | 🔴 **Ye asli chaabi hai.** Ye leak hui to koi bhi aapke server ka poora control le sakta hai |

`DEPLOY_SSH_KEY` daalte waqt **poori file** paste karein — `-----BEGIN` wali
line se `-----END` wali line tak, beech ke saare newlines ke saath. Sirf
beech ka hissa paste karna sabse common galti hai, aur error message
(`invalid format`) usse aasani se samajh nahi aata.

> **PUBLIC key nahi, PRIVATE key.** Public key (`.pub` wali) server pe
> `~/.ssh/authorized_keys` me jaati hai. Private key (bina extension wali)
> GitHub secret me jaati hai. Ulta karne se deploy kabhi kaam nahi karega.

## Sawaal: Teeno environments me SAME naam kyun? Confusing nahi hoga?

Ye ulta hai — **isi se confusion khatam hoti hai.** Ye is poore setup ka
sabse smart hissa hai.

Dekhiye `deploy.yml` me kya likha hai:

```yaml
environment: ${{ needs.resolve.outputs.environment }}   # ← ye line jaadu hai
...
env:
  DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}   # naam ek hi baar likha hai
```

`environment:` line GitHub ko batati hai ki **kaunsa dabba kholna hai**.
Uske baad `secrets.DEPLOY_HOST` apne aap usi dabbe se value uthata hai:

| Run kis branch se | environment | `secrets.DEPLOY_HOST` ki value |
|---|---|---|
| `develop` | `development` | `10.0.0.5` (dev server) |
| `staging` | `staging` | `10.0.0.9` (staging server) |
| `main` | `production` | `203.0.113.45` (prod server) |

Ek hi line, teen alag values. **Workflow me koi if-else nahi likhna padta.**

Agar naam alag-alag hote (`DEV_DEPLOY_HOST`, `STAGING_DEPLOY_HOST`,
`PROD_DEPLOY_HOST`) to workflow me aisa kuch likhna padta:

```yaml
# ❌ Aisa MAT karein — ye pura anti-pattern hai
DEPLOY_HOST: ${{ github.ref == 'refs/heads/main'
  && secrets.PROD_DEPLOY_HOST
  || github.ref == 'refs/heads/staging'
  && secrets.STAGING_DEPLOY_HOST
  || secrets.DEV_DEPLOY_HOST }}
```

Ye 4 secrets × 3 environments = **12 branches of if-else** ban jaata, har
secret ke liye. Padhne me bhayanak, aur ek galat condition ka matlab hai
production pe staging ka code, ya usse bura.

Same naam rakhne se: **jo badalta hai (value) wo GitHub me hai, jo same
rehta hai (logic) wo code me hai.** Ye har achhe config system ka basic
principle hai.

## Sawaal: Repository level pe kyun nahi rakh sakte?

Rakh to sakte ho. Par ye ek **security hole** hai, aur teen alag reasons se:

### Reason 1 — Repository secret HAR job ko dikhta hai

Repository-level secret ka matlab hai: is repo ka koi bhi workflow, koi bhi
job, kabhi bhi use padh sakta hai. To agar production ki SSH key repo level
pe hui:

- `develop` branch ka deploy production ki key padh sakta hai
- CI ka `npm test` step production ki key padh sakta hai
- **Kisi bhi contributor ka PR** us key tak pahunchne ki koshish kar sakta hai

Environment secret ulta kaam karta hai — wo **sirf us job ko** milta hai
jisme `environment: production` likha ho. Staging ka run production ki key
ko **chhoo bhi nahi sakta**, chahe koi jaan-boojh kar koshish kare.

Ye "blast radius" ka concept hai: agar kuch galat ho, to nuksaan kitni door
tak jayega? Environment secrets se production ka blast radius sirf
production tak simat jaata hai.

### Reason 2 — Repo level pe teen values rakh hi nahi sakte

Ek repository me `DEPLOY_HOST` naam ka **sirf ek** secret ho sakta hai.
Aapko teen chahiye. To majboori me naam alag rakhne padenge
(`PROD_DEPLOY_HOST` etc.), aur phir upar wala 12-branch if-else wala
bhayanak code likhna padega.

Environments isliye bane hi hain — ek naam, alag-alag scope me alag value.

### Reason 3 — Repo level pe approval nahi laga sakte

Required reviewers ek **environment ka feature** hai. Agar secrets repo level
pe hain aur workflow me `environment:` line hi nahi hai, to production deploy
ko rokne ka koi tareeka nahi bachta. Har merge seedha live.

### Seedha comparison

| | Repository secret | Environment secret |
|---|---|---|
| Kaun padh sakta hai | Har workflow, har job | Sirf `environment: <naam>` wali job |
| Ek naam, kai values | ❌ Nahi | ✅ Haan |
| Approval laga sakte ho | ❌ Nahi | ✅ Haan |
| Deploy history | ❌ Nahi | ✅ Haan |
| Kis branch se chal sakta hai, control | ❌ Nahi | ✅ Haan |

**Niyam:** deploy se juda koi bhi secret hamesha environment level pe.
Repository level sirf un cheezon ke liye jo sach me sab jagah same hain aur
jinka leak hona bada nuksaan na kare.

## Kaise daalein

**Har environment ke liye alag se** ye karna hoga (teen baar):

1. **Settings** ▸ **Environments** ▸ `development` pe click
2. Neeche scroll → section **Environment secrets** ▸ **Add environment secret**
3. Name: `DEPLOY_HOST`, Value: dev server ka IP ▸ **Add secret**
4. Yahi 3 baar aur: `DEPLOY_USER`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY`
5. Ab wapas **Environments** ▸ `staging` ▸ wahi 4 secrets, **staging ki values**
6. Phir **Environments** ▸ `production` ▸ wahi 4 secrets, **production ki values**

Total 12 secrets (4 × 3), par workflow me naam sirf 4 hi likhe hain.

> ⚠️ **Yahan nahi daalna:** _Settings ▸ Secrets and variables ▸ Actions_
> wala page. Wo **repository** secrets hain. Dono pages dekhne me lagbhag
> ek jaise hain — yahi sabse common galti hai. Hamesha **Environments** wale
> raaste se jaayein.
>
> Pehchaan: agar page ke upar environment ka naam (`production`) likha hai,
> to aap sahi jagah ho.

Secret save karne ke baad uski value **kabhi wapas nahi dikhegi** — sirf
badal sakte ho. Ye by design hai. Logs me bhi ye apne aap `***` ho jaati hai.

---

# Part 3 — Required reviewers (production ka safety net)

## Sawaal: Ye kyun chahiye?

Iske bina `main` me PR merge hote hi production deploy **turant** shuru ho
jaata hai. Koi rukavat nahi.

Zyada tar din ye theek hai. Par:
- Friday shaam 6 baje ka merge
- Ek merge jisme reviewer ne dhyan se nahi dekha
- Ek migration jise DB backup ke baad chalna chahiye tha

Required reviewers ek **manual pause button** hai. Deploy job shuru hoti hai
aur wahi ruk jaati hai — GitHub notification bhejta hai, koi insaan dekh kar
**Approve** dabata hai, tab deploy aage badhta hai. Reject karne se kuch nahi
hota, jaise merge hua hi na ho.

Ye code ko slow nahi karta — merge to ho hi chuka hai. Ye sirf us aakhri
step pe ek jodi aankhein lagata hai jiske baad wapas aana mushkil hai.

## Kaise lagayein

1. **Settings** ▸ **Environments** ▸ **`production`**
2. Section **Deployment protection rules**
3. ☑️ **Required reviewers** → apna naam (aur team ka koi ek aur) add karein
4. **Save protection rules**

Do aur useful options wahi pe:

- **Wait timer** — deploy se pehle X minute ruko. "Arre galat merge kar diya"
  wale moment me cancel karne ka time mil jaata hai.
- **Deployment branches** — "Selected branches" chunein aur `main` likhein.
  Iska matlab: production environment ke secrets sirf `main` se chalne wale
  run ko milenge. Koi random branch banakar production ki key nahi nikaal
  sakta. **Ye zaroor lagayein** — 30 second ka kaam hai.

`staging` pe sirf **Deployment branches** = `staging` laga dein, reviewers ki
zaroorat nahi. `development` pe kuch mat lagayein — wahan rukavat ulta
nuksaan karti hai.

---

# Part 4 — Branch protection

## Sawaal: Environment protection aur branch protection alag cheez hai?

Haan, bilkul alag. Dono ki zaroorat hai. Ye sabse zyada confuse karne wala
hissa hai, to seedha samjhiye:

```
   Branch protection            Environment protection
   ─────────────────            ──────────────────────
   "code branch me GHUS         "code server pe JAA
    kaise sakta hai?"            kaise sakta hai?"

   Merge se PEHLE               Merge ke BAAD
   Settings ▸ Rules             Settings ▸ Environments
```

Branch protection ke bina koi bhi seedha `main` pe push kar sakta hai, bina
PR ke, bina CI ke — aur phir environment protection ka koi matlab nahi bachta
kyunki galat code pehle hi `main` me pahunch chuka hai.

## Sawaal: GitHub me ye kahan se kholenge?

GitHub ke paas iske **do** systems hain. Naya wala use karein:

### ✅ Naya tareeka — Rulesets (recommended)

```
Repo ▸ Settings ▸ (left sidebar) Rules ▸ Rulesets ▸ New ruleset ▸ New branch ruleset
```

Left sidebar me **Rules** ek expandable item hai — uspe click karne se andar
**Rulesets** dikhta hai.

Ye isliye behtar hai kyunki ek hi ruleset me aap `main` aur `staging` dono
cover kar sakte ho, aur baad me on/off toggle kar sakte ho.

### Purana tareeka — Branch protection rules

```
Repo ▸ Settings ▸ (left sidebar) Branches ▸ Add branch protection rule
```

Ye abhi bhi kaam karta hai. Purane tutorials me yahi milega. Par har branch
ke liye alag rule banana padta hai.

> Dono ek saath use na karein — dono lagane se rules add ho jaate hain
> (sabse strict jeetta hai) aur debug karna mushkil ho jaata hai.

## Ruleset banane ke steps

**Settings ▸ Rules ▸ Rulesets ▸ New ruleset ▸ New branch ruleset**

1. **Ruleset Name**: `protected-branches`
2. **Enforcement status**: `Active` ← ye badalna mat bhoolein, default
   `Disabled` hota hai aur phir kuch bhi lagu nahi hota
3. **Target branches** ▸ **Add target** ▸ **Include by pattern**:
   - `main` add karein
   - phir dobara **Add target** ▸ `staging` add karein
4. **Rules** section me ye checkboxes:

   | Checkbox | Kyun |
   |---|---|
   | ☑️ **Restrict deletions** | `main` galti se delete na ho |
   | ☑️ **Block force pushes** | `--force` history mita deta hai, aur usse recover karna bahut mushkil hai |
   | ☑️ **Require a pull request before merging** | Har change kisi aur ki nazar se guzre |
   | └ Required approvals: **1** | Chhoti team me 1 kaafi hai |
   | └ ☑️ Dismiss stale approvals | Approval ke baad naya commit push hua? Dobara review ho |
   | ☑️ **Require status checks to pass** | CI red hone par merge button block ho jaata hai |
   | └ ☑️ Require branches to be up to date | Aapki branch purani hai to pehle `main` merge karo. Isse wo case bachta hai jahan do PR alag-alag green the par milne ke baad tut gaye |

5. **Require status checks** ke andar checks add karein — ye naam type karein:
   ```
   API
   Worker
   Web
   Docker build
   ```

   > Ye naam `ci.yml` me har job ke `name:` field se aate hain. GitHub ye
   > list tabhi suggest karta hai jab CI **kam se kam ek baar chal chuka ho**.
   > Isliye ye step sabse aakhir me karein — pehle ek dummy PR khol kar CI
   > chala lein, phir yahan naam add karein.
   >
   > `Audit` ko yahan **mat** daalein — wo abhi `continue-on-error: true` pe
   > hai (Angular 18 ke known advisories ki wajah se), to wo gate nahi ban
   > sakta.

6. **Create**

### develop ke liye alag, halka ruleset

`develop` pe utni sakhti nuksaan karti hai — roz ka kaam ruk jaata hai.
Ek doosra ruleset banayein:

- Name: `develop-checks`, Enforcement: `Active`
- Target: `develop`
- Rules: ☑️ Block force pushes, ☑️ Require status checks (`API`, `Worker`, `Web`)
- **Pull request required = NAHI** (ya required approvals `0`)

Matlab: develop pe CI green hona zaroori hai, par har chhote commit ke liye
kisi ka approval nahi chahiye.

---

# Part 5 — Default branch

## Sawaal: Default branch badalna kyun zaroori hai?

Abhi aapke repo ka default `main` hai. Default branch wo hai jo:
- Repo kholte hi dikhta hai
- **Naya PR kholte waqt by-default target banta hai** ← asli problem yahi hai

To developer feature branch se PR kholega, GitHub upar se `main` pehle se
bhar dega, aur agar usne dhyan nahi diya — wo feature seedha `main` me merge
ho jaayega. **Staging bypass. QA bypass. Seedha production.**

Ye galti itni common hai ki har team ke saath hoti hai. Default `develop`
karne se GitHub khud sahi target bhar dega, aur `main` pe PR kholna ek
jaan-boojh kar kiya gaya kaam ban jaayega.

## Kaise badlein

Pehle branches banani hongi (agar nahi bani hain):

```bash
git checkout main
git pull origin main

git checkout -b staging
git push -u origin staging

git checkout -b develop
git push -u origin develop
```

Phir GitHub pe:

1. **Settings** ▸ **General** (sabse pehla page)
2. Neeche scroll → **Default branch** section
3. Branch naam ke bagal wala **⇄ switch icon** dabayein
4. `develop` chunein ▸ **Update** ▸ confirm

---

# Part 6 — Server taiyar karo

## Sawaal: Har server pe alag branch kyun checkout karni hai?

`ops/deploy.sh` server pe ye chalati hai:

```bash
git fetch --prune origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
```

`$BRANCH` GitHub se aata hai (`DEPLOY_BRANCH`), to technically script khud
sahi branch pe switch kar legi. Par **pehli baar** repo clone karte waqt
sahi branch pe rakhna behtar hai — taaki agar aap kabhi server pe manually
`ops/deploy.sh` chalayein, to wo galat branch deploy na kar de.

Har server pe ek baar:

```bash
sudo mkdir -p /srv/mean-task-manager
sudo chown "$USER" /srv/mean-task-manager

git clone https://github.com/brijeshkrverma/mean_task_manager.git /srv/mean-task-manager
cd /srv/mean-task-manager

# dev server pe:      git checkout develop
# staging server pe:  git checkout staging
# production pe:      git checkout main
git checkout develop

cp .env.example .env
nano .env        # asli values bharein — JWT_SECRET zaroori hai
```

⚠️ `git reset --hard` ka matlab hai **server pe kiye gaye local changes mit
jayenge**. Ye jaan-boojh kar hai: server ki state hamesha git se match honi
chahiye, warna "server pe kya chal raha hai" ka jawab kisi ko nahi pata
hota. `.env` git me track nahi hai, isliye wo safe rehti hai.

## SSH key setup

Har server pe (ya ek key teeno ke liye — par alag-alag behtar hai):

```bash
# Apne LAPTOP pe key banayein
ssh-keygen -t ed25519 -C "github-deploy-production" -f ~/.ssh/deploy_prod

# PUBLIC key server pe bhejein
ssh-copy-id -i ~/.ssh/deploy_prod.pub deploy@203.0.113.45

# PRIVATE key ka content GitHub secret DEPLOY_SSH_KEY me paste karein
cat ~/.ssh/deploy_prod
```

Aakhri command ka **poora output** copy karein — `-----BEGIN` se `-----END`
tak.

---

# Checklist

Sab kuch ho gaya? Ek-ek karke tick karein:

**Branches**
- [ ] `staging` branch bani aur push hui
- [ ] `develop` branch bani aur push hui
- [ ] Default branch `develop` set hua

**Environments** (Settings ▸ Environments)
- [ ] `development` bana
- [ ] `staging` bana
- [ ] `production` bana
- [ ] `development` me 4 secrets (dev server ki values)
- [ ] `staging` me 4 secrets (staging server ki values)
- [ ] `production` me 4 secrets (prod server ki values)
- [ ] `production` pe Required reviewers laga
- [ ] `production` pe Deployment branches = `main`
- [ ] `staging` pe Deployment branches = `staging`

**Rules** (Settings ▸ Rules ▸ Rulesets)
- [ ] `protected-branches` ruleset — target `main` + `staging`, Active
- [ ] `develop-checks` ruleset — target `develop`, Active
- [ ] Status checks add hue (CI ek baar chalne ke BAAD)

**Servers**
- [ ] Dev server: repo clone, `develop` pe, `.env` bhara
- [ ] Staging server: repo clone, `staging` pe, `.env` bhara
- [ ] Prod server: repo clone, `main` pe, `.env` bhara
- [ ] Teeno pe SSH public key `authorized_keys` me

---

# Test karke dekhein

Sab set hone ke baad sabse safe test:

```bash
git checkout develop
git pull origin develop
git commit --allow-empty -m "chore: test deploy pipeline"
git push origin develop
```

Ab **Actions** tab kholein. Ye order dikhna chahiye:

1. **CI** chalti hai — 5 jobs (API, Worker, Web, Audit ×3, Docker build)
2. CI green hone par **Deploy** apne aap shuru hoti hai
3. Deploy me `Resolve target` job dikhati hai: `develop ──► development`
4. `Deploy to development` job chalti hai
5. Run ke summary page pe environment / branch / commit ki table dikhti hai

Kuch galat ho to sabse pehle **Resolve target** job ke logs dekhein — wo
saaf batati hai ki kaunsa environment chuna gaya. Aksar problem wahi hoti
hai: environment ka naam GitHub pe alag likha hai.

---

## Related

- [BRANCHING.md](BRANCHING.md) — rozana ka git flow, release, hotfix, rollback
- [../.github/workflows/ci.yml](../.github/workflows/ci.yml) — CI, line-by-line commented
- [../.github/workflows/deploy.yml](../.github/workflows/deploy.yml) — Deploy, line-by-line commented
