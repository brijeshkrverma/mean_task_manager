Setup ssh key on github

 1. ssh-keygen -t ed25519 -C "brijeshverma957@gmail.com" -f ~/.ssh/github_brijesh
 2. cat ~/.ssh/github_brijesh.pub

3. nano ~/.ssh/config
Paste: `Host github-brijesh
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_brijesh
    IdentitiesOnly yes`

Save: Ctrl + O → Enter → Ctrl + X

Phir Test:- ssh -T git@github-brijesh


git init
git status
git add .
git commit -m "committed comment..."

git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/REPOSITORY_NAME.git
git push -u origin main



## Tutorial

Yesss! 🎉 **Code successfully GitHub par push ho gaya.**

Ab hum tumhare liye **Git/GitHub commands ka practical course** karenge—ek-ek command ko actually run karoge, sirf theory nahi.

## Step 1 — Repository ki current state

Project folder mein:

```cmd
git status
```

Samjho:

```text
working tree clean
```

iska matlab koi uncommitted change nahi.

---

## Step 2 — Current branch

```cmd
git branch
```

Expected:

```text
* main
```

`*` current branch batata hai.

---

## Step 3 — Remote repository

```cmd
git remote -v
```

Tumhara output roughly:

```text
origin  git@github-brijesh:brijeshkrverma/Mean_Project.git (fetch)
origin  git@github-brijesh:brijeshkrverma/Mean_Project.git (push)
```

---

## Step 4 — Branches dekho

```cmd
git branch -a
```

Ye local + remote branches dikhayega.

---

## Step 5 — Commit history

```cmd
git log --oneline
```

Example:

```text
a1b2c3d Merge remote main with local project
e4f5g6h Initial project setup
```

Detailed history:

```cmd
git log
```

---

## Step 6 — Last commit ki details

```cmd
git show
```

Ye batayega ki last commit mein kya change hua.

---

## Step 7 — GitHub se latest changes lana

```cmd
git pull origin main
```

Meaning:

```text
GitHub
  ↓
Local
```

---

## Step 8 — Local changes GitHub se compare karo

```cmd
git fetch origin
```

`fetch` changes download karta hai, **lekin automatically tumhare working files merge nahi karta**.

Phir:

```cmd
git status
```

---

## Step 9 — New branch banana

Ab direct `main` par feature mat banao:

```cmd
git checkout -b feature/task-filter
```

Check:

```cmd
git branch
```

---

## Step 10 — Branch change karna

```cmd
git checkout main
```

Ya modern command:

```cmd
git switch main
```

Feature branch:

```cmd
git switch feature/task-filter
```

---

## Step 11 — Change karo

Example kisi file mein ek small change karo.

Phir:

```cmd
git status
```

Tumhe changed file dikhegi.

---

## Step 12 — Changes ka difference dekho

```cmd
git diff
```

Ye **unstaged changes** dikhata hai.

---

## Step 13 — Stage karo

```cmd
git add .
```

Phir:

```cmd
git status
```

Ab file staged hogi.

---

## Step 14 — Staged changes ka diff

```cmd
git diff --cached
```

Ye check karta hai ki commit hone wale changes exactly kya hain.

---

## Step 15 — Commit

```cmd
git commit -m "Add task filter"
```

---

## Step 16 — Feature branch GitHub par push

```cmd
git push -u origin feature/task-filter
```

`-u` ke baad future mein simply:

```cmd
git push
```

use kar sakte ho.

---

# Step 17 — GitHub par Pull Request

GitHub kholo → repository → **Compare & pull request**

```text
feature/task-filter
        ↓
       main
```

PR create karo.

Tumhara real workflow ab:

```text
Feature
   ↓
git add
   ↓
git commit
   ↓
git push
   ↓
Pull Request
   ↓
Review
   ↓
Merge
```

---

# Step 18 — Merge ke baad local main update

PR GitHub par merge hone ke baad:

```cmd
git switch main
git pull origin main
```

---

# Step 19 — Feature branch delete

Local:

```cmd
git branch -d feature/task-filter
```

Remote:

```cmd
git push origin --delete feature/task-filter
```

---

# Step 20 — Kisi commit par wapas jaana

History:

```cmd
git log --oneline
```

Specific commit dekhna:

```cmd
git show COMMIT_ID
```

Temporary old version:

```cmd
git checkout COMMIT_ID
```

⚠️ Isse **detached HEAD** aa sakta hai; abhi ise practice mein later karna better hai.

---

# Step 21 — Safe rollback

Agar latest commit galat hai aur usko undo karna hai:

```cmd
git revert COMMIT_ID
```

Phir:

```cmd
git push
```

Production mein **`git revert` generally safer rollback approach** hai compared with rewriting shared history.

---

# Step 22 — Staged file ko unstage karna

```cmd
git restore --staged filename
```

Example:

```cmd
git restore --staged README.md
```

---

# Step 23 — Local change discard karna

⚠️ Ye change permanently hata sakta hai:

```cmd
git restore filename
```

Example:

```cmd
git restore README.md
```

---

# Step 24 — Commit amend

Agar commit message galat hai aur commit abhi push nahi hua:

```cmd
git commit --amend -m "Better commit message"
```

---

# Step 25 — GitHub branches dekho

```cmd
git branch -r
```

Example:

```text
origin/main
origin/feature/task-filter
```

---

# Step 26 — Stash

Agar current work temporary side mein rakhna hai:

```cmd
git stash
```

Changes wapas:

```cmd
git stash pop
```

Stashes dekho:

```cmd
git stash list
```

---

# Step 27 — Tags

Release mark karne ke liye:

```cmd
git tag v1.0.0
git push origin v1.0.0
```

Tum later ise Docker image versions ke saath connect kar sakte ho.

---

# Step 28 — GitHub workflow ke important commands

Tumhe ultimately ye commands **confidently** aani chahiye:

```cmd
git init
git clone
git status
git add
git commit
git push
git pull
git fetch
git branch
git switch
git merge
git rebase
git diff
git log
git show
git stash
git restore
git revert
git tag
git remote
```

### Ab practical learning order

Hum isko aise practice karenge:

```text
1. status
2. branch
3. switch
4. add
5. diff
6. commit
7. push
8. fetch
9. pull
10. Pull Request
11. merge
12. revert
13. stash
14. restore
15. rebase
16. tag
17. GitHub Actions
```

**Abhi sirf Step 1 karo:**

```cmd
git status
```

Uska output bhejo. Phir main **next command** dunga aur hum poora Git/GitHub workflow tumhare `Mean_Project` par practically complete karenge.
