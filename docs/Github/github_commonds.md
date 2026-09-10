Create a complete, beginner-friendly, practical **Git & GitHub Learning Documentation** as a single standalone HTML file.

## MAIN GOAL

The learner already knows basic coding and has a real MEAN Stack project, but does NOT clearly understand what Git commands actually do internally.

The documentation must teach Git and GitHub in a **true step-by-step practical way**, not by simply listing commands.

The most important rule:

> For EVERY command, explain exactly:
>
> * What each word means
> * What each symbol means
> * What Git is doing
> * Where the change is going
> * What the learner should expect to see
> * Why the command is needed
> * What happens if the command is skipped
> * How to verify that it worked
> * How to undo it safely

The learner must understand the concept before moving to the next command.

---

# TARGET LEARNER

Assume:

* Beginner to Git
* Knows JavaScript/TypeScript/Angular/Node.js
* Has a real MEAN project
* Uses Windows
* Uses Git Bash and Windows CMD
* Uses GitHub
* Has already created an SSH key
* Has a GitHub repository
* Wants to learn Git professionally for CI/CD and deployment

Use the example project:

MEAN Task Manager

Example local path:

D:\All_Test\mean-task-manager

Example GitHub repository:

git@github-brijesh:brijeshkrverma/Mean_Project.git

Do NOT assume the learner knows Git terminology.

---

# TEACHING STYLE

Use extremely simple English.

Avoid unnecessary theory.

Use short explanations.

Prefer:

"Git sees your changed files."

instead of:

"Git indexes modified working-tree paths into the staging area."

However, after the simple explanation, also provide the correct technical term.

Example:

Simple meaning:
"Git prepares this file for the next commit."

Technical term:
"This is called staging."

---

# MOST IMPORTANT TEACHING METHOD

For every command, break the command into pieces.

Example:

Command:

git add .

Explain:

git
= run Git

add
= put selected changes into the staging area

.
= current directory and everything inside it that Git can track

Then explain:

Before:

Working Directory
↓
Changed files

After:

Working Directory
↓
Staging Area
↓
Commit

Also explain:

`git add .` does NOT mean:

* upload to GitHub
* save to GitHub
* create a commit
* deploy the application

It ONLY stages changes for the next commit.

Use this level of explanation for EVERY important command.

---

# GIT INTERNAL MODEL

Create a visual section explaining these 4 areas:

1. Working Directory
2. Staging Area / Index
3. Local Repository
4. Remote Repository (GitHub)

Use this diagram:

Working Directory
↓
git add
↓
Staging Area
↓
git commit
↓
Local Repository
↓
git push
↓
GitHub Remote Repository

And reverse direction:

GitHub
↓
git fetch / git pull
↓
Local Repository / Working Directory

Explain exactly what changes in each stage.

---

# FIRST SECTION — WHAT IS GIT?

Explain:

* What Git is
* Why developers use Git
* What problem Git solves
* Git vs GitHub
* Local repository vs remote repository
* Why commits are useful
* Why branches exist
* Why rollback is possible

Use real examples.

---

# SECOND SECTION — INSTALLATION AND CHECK

Teach:

git --version

Explain:

* What `--version` means
* What output should look like
* What to do if Git is not installed

Also teach:

git config --global user.name "Brijesh Verma"

git config --global user.email "[brijeshverma957@gmail.com](mailto:brijeshverma957@gmail.com)"

Then:

git config --global --list

Explain exactly what `--global` means.

Explain difference between:

global configuration
local repository configuration

---

# THIRD SECTION — CREATE / INITIALIZE REPOSITORY

Teach:

cd "D:\All_Test\mean-task-manager"

Then:

git init

Explain:

* What `cd` does
* Why we enter the project folder
* What `git init` actually creates
* Why `.git` folder is created
* What the `.git` directory contains at a high level
* Why `.git` should not normally be deleted

Show:

Before:

mean-task-manager/
api/
web/
README.md

After:

mean-task-manager/
.git/
api/
web/
README.md

---

# FOURTH SECTION — CHECK STATUS

Teach:

git status

Explain:

* Why this command should be used frequently
* What "untracked files" means
* What "modified" means
* What "changes to be committed" means
* What "working tree clean" means

Create examples of multiple status outputs and explain every line.

---

# FIFTH SECTION — GIT ADD

This is the most important teaching section.

Explain:

git add .

Break it into:

git
add
.

Then compare:

git add file.txt

git add api/src/index.js

git add .

git add api/

Explain exactly what each selects.

Explain that:

`git add .`

means:

"Stage changes from the current directory and its subdirectories."

Explain that the `.` is a path, not a Git command.

Explain:

Working Directory
↓
git add
↓
Staging Area

Give a practical example:

Before `git add`:

README.md = modified
api/src/index.js = modified

After:

git status

Explain what moved into:

"Changes to be committed"

Also teach:

git restore --staged filename

Explain how to remove a file from staging without deleting the file.

---

# SIXTH SECTION — COMMIT

Teach:

git commit -m "Initial project setup"

Break into:

git
commit
-m
"Initial project setup"

Explain:

`commit`
= create a snapshot/checkpoint in the local Git repository

`-m`
= provide commit message

Message
= human-readable description

Show:

Working Directory
↓
git add
↓
Staging Area
↓
git commit
↓
Local Repository

Explain clearly:

Commit does NOT push code to GitHub.

Create examples:

git commit -m "Add login feature"

git commit -m "Fix task API"

git commit -m "Add Docker configuration"

Explain why meaningful messages matter.

---

# SEVENTH SECTION — GIT LOG

Teach:

git log

git log --oneline

Explain:

* commit hash
* author
* date
* commit message

Explain `--oneline` character by character conceptually.

Show sample output and explain every part.

---

# EIGHTH SECTION — GIT DIFF

Teach:

git diff

git diff --cached

Explain the difference:

git diff
= changes not staged

git diff --cached
= changes already staged

Create a visual table.

---

# NINTH SECTION — GITHUB REMOTE

Explain:

What is `origin`?

Teach:

git remote -v

Explain:

origin
= local nickname for remote repository

Explain:

fetch URL
push URL

Teach:

git remote add origin <URL>

Break the command into pieces.

Explain what happens internally.

---

# TENTH SECTION — BRANCHES

Teach:

git branch

git branch -M main

git checkout -b feature/task-crud

git switch main

git switch feature/task-crud

Explain:

* branch concept
* why main should be protected
* why feature branches are used
* what `-b` means
* what `-M` means
* current branch indicator `*`

Show diagrams.

Example:

main
|
+--- feature/login
|
+--- feature/task-crud

---

# ELEVENTH SECTION — PUSH

Teach:

git push -u origin main

Break into:

git
push
-u
origin
main

Explain exactly what gets sent:

Local commit(s)
↓
GitHub

Explain:

* `origin`
* `main`
* `-u`
* upstream tracking

Then explain future:

git push

Why it works after `-u`.

---

# TWELFTH SECTION — PULL

Teach:

git pull origin main

Explain:

pull is roughly:

fetch
+
merge/rebase depending on configuration

Show simple conceptual flow.

Explain when to use pull.

Explain why pulling before starting work can reduce conflicts.

---

# THIRTEENTH SECTION — FETCH

Teach:

git fetch origin

Explain:

* downloads remote updates
* does NOT automatically change working files
* useful for inspecting remote changes safely

Compare:

fetch vs pull

---

# FOURTEENTH SECTION — MERGE

Teach:

git merge feature/task-crud

Explain:

* what merge means
* why merge creates combined history
* fast-forward vs merge commit at beginner level

Use simple diagrams.

---

# FIFTEENTH SECTION — PULL REQUEST

Explain:

What is a Pull Request?

Explain:

feature branch
↓
push
↓
GitHub
↓
Pull Request
↓
Review
↓
CI
↓
Merge

Explain that PR is a GitHub collaboration feature, not a Git command.

---

# SIXTEENTH SECTION — REBASE

Teach beginner-safe explanation of:

git rebase main

Explain:

* what rebase does
* why developers use it
* difference between merge and rebase
* why rebase rewrites commit history
* why beginners should be careful on shared branches

Also teach:

git rebase --abort

---

# SEVENTEENTH SECTION — STASH

Teach:

git stash

git stash list

git stash pop

git stash apply

Explain:

Why stash exists.

Example:

You are working on Feature A.

Urgent task comes.

You need to switch branches.

Explain how stash temporarily stores uncommitted work.

---

# EIGHTEENTH SECTION — RESTORE / RESET / REVERT

This section must be very clear.

Teach:

git restore filename

git restore --staged filename

git reset

git reset --soft

git reset --mixed

git reset --hard

git revert <commit>

Explain the difference carefully.

Create a safety table:

Command | What it changes | Safe? | Typical use

Strong warning for:

git reset --hard

Explain that it can destroy uncommitted work.

Explain why `git revert` is generally safer for already shared commits.

---

# NINETEENTH SECTION — TAGS

Teach:

git tag v1.0.0

git push origin v1.0.0

Explain release versions.

Show:

v1.0.0
v1.1.0
v2.0.0

Explain semantic versioning briefly.

---

# TWENTIETH SECTION — CLONE

Teach:

git clone <repository-url>

Explain exactly:

GitHub
↓
Local machine

Compare:

git init
vs
git clone

---

# TWENTY-FIRST SECTION — SSH

Explain:

* What SSH is
* Why GitHub uses SSH keys
* public key
* private key
* why private key must stay secret
* what the SSH config file does
* why multiple GitHub accounts may need aliases

Use example:

Host github-brijesh
HostName github.com
User git
IdentityFile ~/.ssh/github_brijesh
IdentitiesOnly yes

Explain every line.

Explain:

ssh -T git@github-brijesh

And what successful output means.

---

# TWENTY-SECOND SECTION — MULTIPLE GITHUB ACCOUNTS

The learner uses two GitHub accounts.

Explain how SSH aliases work.

Example:

Host github-personal
HostName github.com
User git
IdentityFile ~/.ssh/github_personal
IdentitiesOnly yes

Host github-work
HostName github.com
User git
IdentityFile ~/.ssh/github_work
IdentitiesOnly yes

Explain repository remote:

git remote set-url origin git@github-personal:USERNAME/REPO.git

Explain why this prevents accidental authentication with the wrong account.

---

# TWENTY-THIRD SECTION — REAL PROJECT WORKFLOW

Use the MEAN Task Manager project.

Teach this exact workflow:

1. Start from main
2. Pull latest changes
3. Create feature branch
4. Change code
5. Check status
6. Inspect diff
7. Stage changes
8. Inspect staged diff
9. Commit
10. Push branch
11. Open Pull Request
12. CI runs
13. Review
14. Merge
15. Switch to main
16. Pull latest main
17. Delete feature branch

Give exact commands.

---

# TWENTY-FOURTH SECTION — COMPLETE GIT DEPLOYMENT FLOW

Use:

Code
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
↓
Build
↓
Test
↓
Merge
↓
Deploy
↓
Monitor
↓
Rollback

Explain where Git ends and CI/CD begins.

---

# TWENTY-FIFTH SECTION — ERROR TRAINING

Create a "Common Git Errors Lab".

Include:

1. Permission denied (publickey)
2. remote origin already exists
3. rejected: fetch first
4. merge conflict
5. branch does not exist
6. not a git repository
7. failed to push some refs
8. authentication failure
9. unrelated histories
10. merge conflict in README.md

For each error:

* Why it happens
* Exact meaning
* How to diagnose
* Safe fix
* What NOT to do
* Verification command

---

# TWENTY-SIXTH SECTION — MERGE CONFLICT PRACTICE

Create a real beginner simulation.

Explain:

<<<<<<< HEAD
local code
==========

remote code

> > > > > > > main

Explain what each marker means.

Teach:

1. Open file
2. Decide final content
3. Remove conflict markers
4. Save
5. git add filename
6. git commit
7. git push

Also explain:

git merge --abort

---

# TWENTY-SEVENTH SECTION — GIT COMMAND CHEAT SHEET

Create a table:

Command
Purpose
What it changes
Typical use
Danger level

Include:

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
git checkout
git merge
git rebase
git diff
git log
git show
git stash
git restore
git reset
git revert
git remote
git tag

---

# TWENTY-EIGHTH SECTION — "WHAT DOES THIS SYMBOL MEAN?"

Create a dedicated mini-course.

Explain:

.
..
/

~
-

--
:
*
@

Examples:

git add .
git log --oneline
git checkout -b feature/test
git branch -M main
git remote -v

The learner should understand common Git syntax instead of memorizing commands blindly.

---

# TWENTY-NINTH SECTION — PRACTICAL EXERCISES

Create exercises in increasing difficulty.

LEVEL 1:
Check Git version.

LEVEL 2:
Create repository.

LEVEL 3:
Create file and check status.

LEVEL 4:
Stage file.

LEVEL 5:
Commit file.

LEVEL 6:
Create branch.

LEVEL 7:
Push branch.

LEVEL 8:
Create Pull Request.

LEVEL 9:
Create merge conflict intentionally.

LEVEL 10:
Resolve conflict.

LEVEL 11:
Stash changes.

LEVEL 12:
Revert a commit.

LEVEL 13:
Create tag.

LEVEL 14:
Perform safe rollback.

For every exercise provide:

Goal
Starting state
Command
Expected output
Why it works
Verification
Common mistake
Success condition

---

# THIRTIETH SECTION — MINI PROJECT

Create a full practical Git workflow using:

MEAN Task Manager

Feature:

"Task filtering"

Flow:

main
↓
git pull
↓
feature/task-filter
↓
modify Angular code
↓
modify Node API if needed
↓
git status
↓
git diff
↓
git add .
↓
git diff --cached
↓
git commit -m "Add task filter"
↓
git push -u origin feature/task-filter
↓
Pull Request
↓
CI
↓
Review
↓
Merge
↓
git switch main
↓
git pull

Explain every single step.

---

# THIRTY-FIRST SECTION — ROLLBACK LAB

Create practical scenarios:

Scenario A:
Last local commit is wrong.

Scenario B:
Commit already pushed.

Scenario C:
PR already merged.

Scenario D:
Production deployment uses an old Docker image.

Teach the appropriate rollback strategy for each.

Explain:

git revert
vs
git reset
vs
redeploy previous image

---

# THIRTY-SECOND SECTION — GIT + CI/CD

Explain how Git integrates with:

GitHub Actions

Flow:

Git push
↓
GitHub Actions
↓
npm ci
↓
npm test
↓
ng build
↓
Docker build
↓
Deploy

Explain:

* what Git triggers
* what CI does
* what CD does
* where GitHub ends and GitHub Actions begins

---

# THIRTY-THIRD SECTION — GIT SECURITY

Teach:

* Never commit `.env`
* Never commit passwords
* Never commit API keys
* Use `.gitignore`
* SSH private key safety
* GitHub secrets
* Secret rotation
* Force push risks

Show example `.gitignore`:

node_modules/
dist/
.env
.env.*
!.env.example

---

# THIRTY-FOURTH SECTION — PROFESSIONAL BEST PRACTICES

Teach:

* Small commits
* Meaningful commit messages
* Feature branches
* Pull Requests
* Protected main branch
* Code review
* CI before merge
* No secrets in repository
* Regular pull/fetch
* Avoid force push on shared branches

---

# FINAL KNOWLEDGE MAP

Create a visual map:

Git Basics
↓
Repository
↓
Working Directory
↓
Staging
↓
Commit
↓
Branch
↓
Remote
↓
Push/Pull/Fetch
↓
Pull Request
↓
Merge/Rebase
↓
CI/CD
↓
Deployment
↓
Rollback

---

# HTML REQUIREMENTS

Create ONE complete standalone HTML file.

No external frameworks.

No external libraries.

No CDN dependency.

Everything must work offline.

Use:

* HTML
* CSS
* Vanilla JavaScript

Design:

Professional developer/DevOps dashboard.

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

Secondary text:
#94A3B8

Border:
#334155

Success:
#22C55E

Warning:
#F59E0B

Error:
#EF4444

Code background:
#020617

Use a clean modern dark UI.

---

# UI FEATURES

Include:

* Left sidebar navigation
* Search documentation
* Progress tracker
* Chapter completion checkbox
* Previous / Next buttons
* Copy command buttons
* Expand/collapse examples
* Warning boxes
* Tip boxes
* Success boxes
* Error boxes
* Interactive command explanation
* Table of contents
* LocalStorage progress saving
* "Mark step complete"
* Responsive design
* Keyboard-friendly navigation

---

# SPECIAL INTERACTIVE FEATURE

For every important command, create a "Command Breakdown" card.

Example:

COMMAND:

git add .

Clicking each token should highlight its explanation:

git
↓
Git program

add
↓
Stage changes

.
↓
Current directory

Also show:

BEFORE

Working Directory
Modified files

AFTER

Staging Area
Selected files staged

And:

NOT DONE YET:

❌ Not committed
❌ Not pushed to GitHub
❌ Not deployed

---

# REAL-TIME LEARNING RULE

After every major section add:

"Can I move to the next step?"

Checklist:

[ ] I know what the command does
[ ] I know what each argument means
[ ] I know what changes
[ ] I can verify it
[ ] I know how to undo it

Only then mark the section complete.

---

# IMPORTANT CONTENT RULE

Do NOT overcomplicate.

Do NOT fill the document with unnecessary Git internals.

Focus on practical understanding.

Whenever a command can be dangerous, clearly mark it.

Example:

⚠️ DANGER:

git reset --hard

Explain exactly why.

---

# FINAL EXAM

Create a practical final test.

The learner must perform:

1. Clone repository
2. Create feature branch
3. Make code change
4. Stage
5. Commit
6. Push
7. Create PR
8. Resolve a merge conflict
9. Merge
10. Pull main
11. Revert a bad commit
12. Create release tag

At the end show:

Git Skill Level:

Beginner
↓
Working
↓
Intermediate
↓
Production Ready

Only mark "Production Ready" if all practical tasks are completed.

---

# OUTPUT RULE

Return ONLY the complete HTML document.

Do not return explanation outside HTML.

Do not use placeholders.

Do not skip chapters.

Do not use "TODO".

Do not say "continue later".

The final HTML must be complete, functional and ready to save as:

git-github-practical-guide.html
