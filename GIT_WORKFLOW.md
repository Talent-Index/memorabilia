# 🔀 Team Git Workflow — Memorabilia Project

This workflow defines how our 6-member team collaborates on the Memorabilia project (Dojo, Katana, Torii, Telegram Mini App).

We keep the workflow simple and fast: **all feature work branches from `main`.**

---

## 1️⃣ Branches

| Branch | Purpose |
|--------|---------|
| `main` | Single source of truth, protected |
| `feature/<name>-<task>` | Per-developer task branch |

✅ **No direct commits to `main`.**  
✅ **All changes arrive in `main` through Pull Requests (PRs).**

---

## 2️⃣ Naming Convention

```
feature/<yourName>-<taskShortName>
```

### Examples:

```
feature/alex-cairo-build-tests
feature/mary-telegram-mini-app
feature/sam-katana-indexer
feature/john-frontend-blockchain
feature/liz-dojo-telegram-sdk
feature/tom-demo-docs-release
```

---

## 3️⃣ Step-by-Step Workflow

### Step 1: Update main
```bash
git checkout main
git pull origin main
```

### Step 2: Create your feature branch
```bash
git checkout -b feature/<yourName>-<taskShortName>
```

### Step 3: Work & commit
- Commit early and often
- Use descriptive commit messages

```bash
git add .
git commit -m "feat: implement Telegram auth helper"
```

**Commit Message Format:**
```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- test: Adding tests
- refactor: Code refactoring
- chore: Maintenance tasks
```

### Step 4: Rebase before pushing
```bash
git fetch origin
git rebase origin/main
```

**If conflicts occur:**
```bash
# Resolve conflicts in your editor
git add <resolved-files>
git rebase --continue
```

### Step 5: Push branch & open a PR
```bash
git push -u origin feature/<yourName>-<taskShortName>
```

**On GitHub:**
1. Go to repository
2. Click "Compare & pull request"
3. **Base branch:** `main`
4. Fill out PR template (see below)
5. Add logs/screenshots/screen recordings to show acceptance ✅
6. Request review from team member

### Step 6: After merge
```bash
git checkout main
git pull origin main
git branch -d feature/<yourName>-<taskShortName>
```

---

## 4️⃣ PR Acceptance Criteria Per Task

| # | Task | PR Must Include |
|---|------|-----------------|
| 1 | Cairo Contracts Build & Test | ✅ Successful `sozo build`<br>✅ Passing Dojo tests<br>✅ Screenshot of test output |
| 2 | Telegram Mini App Integration | ✅ WebApp detected in console<br>✅ Screenshots of Telegram session<br>✅ Bot link for testing |
| 3 | Katana Deployment & Torii Indexer | ✅ Katana running<br>✅ Torii reachable<br>✅ World address posted<br>✅ Screenshots of all terminals |
| 4 | Frontend Blockchain Flow | ✅ Tx hash shown in console<br>✅ Torii events logged<br>✅ Screen recording of game flow<br>✅ Console logs exported |
| 5 | Dojo–Telegram SDK | ✅ `npm run build` succeeds<br>✅ Example `start_game` success<br>✅ README with usage<br>✅ TypeScript compiles |
| 6 | QA, Docs, Demo | ✅ Demo video (2-3 min)<br>✅ Pitch deck (PDF)<br>✅ Release notes<br>✅ Updated documentation |

---

## 5️⃣ Branch Protection Rules

Enable in GitHub settings (`Settings` → `Branches` → `Branch protection rules`):

- ✅ **Protect `main`**
- ✅ **Require Pull Requests** before merging
- ✅ **Require at least one reviewer**
- ✅ **Require status checks to pass** (if CI/CD enabled)
- ✅ **Require branches to be up to date** before merging
- ✅ **Do not allow force pushes**
- ✅ **Do not allow deletions**

---

## 6️⃣ PR Review Checklist

Before approving a PR, verify:

- [ ] **Rebased on latest `main`**
- [ ] **Acceptance criteria met** ✅ (see Task table above)
- [ ] **No errors/warnings** in console or terminal
- [ ] **Screenshots or logs included**
- [ ] **Code follows project standards**
- [ ] **Tests pass** (if applicable)
- [ ] **Documentation updated** (if needed)
- [ ] **Reviewer approved** ✅

---

## 7️⃣ Merge Style

**Use "Squash and Merge"**

✅ **Benefits:**
- One clean commit per task
- Easier history and rollback
- Cleaner `git log`

**How to:**
1. Click "Squash and merge" button on GitHub
2. Edit commit message to be descriptive
3. Confirm merge
4. Delete branch after merge

---

## 8️⃣ Merge Conflict Prevention

✔ **Pull updates daily**
```bash
git checkout main
git pull origin main
git checkout feature/<yourName>-<task>
git rebase origin/main
```

✔ **Keep PRs small and focused**
- One task per PR
- Avoid mixing unrelated changes

✔ **Communicate when touching same files**
- Coordinate in team chat
- Review open PRs before starting

✔ **Test before pushing**
- Run builds locally
- Test your changes
- Verify no breaking changes

---

## 9️⃣ Common Git Commands

### Update your branch with latest main
```bash
git checkout main
git pull origin main
git checkout feature/<yourName>-<task>
git rebase origin/main
```

### Undo last commit (keep changes)
```bash
git reset --soft HEAD~1
```

### Undo last commit (discard changes)
```bash
git reset --hard HEAD~1
```

### Stash changes temporarily
```bash
git stash
git checkout main
git pull
git checkout feature/<yourName>-<task>
git stash pop
```

### View commit history
```bash
git log --oneline --graph --all
```

### Check branch status
```bash
git status
git branch -a
```

---

## 🔟 Pull Request Template

When creating a PR, use this template:

```markdown
## 📌 Task
**Task #:** [1-6]  
**Task Name:** [e.g., Cairo Contracts Build & Test]  
**Assignee:** [Your Name]

## 📝 Description
[Clear and concise description of what this PR does]

## ✅ Type of Change
Select all that apply:
- [ ] Bug fix 🐛
- [ ] New feature ✨
- [ ] Enhancement 🔧
- [ ] Documentation update 📝
- [ ] Testing 🧪
- [ ] Other (please describe):

## 🎯 Acceptance Criteria
Check all that apply for your task:

### Task 1: Cairo Contracts Build & Test
- [ ] `sozo build` completes without errors
- [ ] All Dojo unit tests pass
- [ ] Screenshot of successful build attached
- [ ] Screenshot of test results attached

### Task 2: Telegram Mini App Integration
- [ ] ngrok exposes local server
- [ ] BotFather Web App URL updated
- [ ] Mini App opens in Telegram
- [ ] Console shows Telegram WebApp detection
- [ ] Screenshot of Telegram session attached
- [ ] Bot link shared for testing

### Task 3: Katana Deployment & Torii Indexer
- [ ] Katana running on port 5050
- [ ] Contracts deployed successfully
- [ ] World address captured and posted
- [ ] Torii indexer running on port 8080
- [ ] Screenshots of all terminals attached

### Task 4: Frontend Blockchain Flow
- [ ] Frontend boots in BLOCKCHAIN MODE
- [ ] Burner account created successfully
- [ ] Game start triggers transaction
- [ ] Transaction hash logged
- [ ] Torii shows events
- [ ] Screen recording attached
- [ ] Console logs exported

### Task 5: Dojo–Telegram SDK
- [ ] Package structure created
- [ ] `npm ci && npm run build` succeeds
- [ ] TypeScript compiles without errors
- [ ] Example usage demonstrates SDK
- [ ] README with installation and usage
- [ ] Screenshot of successful build

### Task 6: QA, Docs, Demo
- [ ] Demo video recorded (2-3 min)
- [ ] Pitch deck created (10-12 slides)
- [ ] All documentation updated
- [ ] QA testing completed
- [ ] Release notes drafted
- [ ] All deliverables attached

## 🧪 How Has This Been Tested?
Describe the testing steps and results:

**Test Environment:**
- [ ] Local development (Katana)
- [ ] Testnet (Sepolia)
- [ ] Telegram (iOS/Android/Desktop)

**Test Steps:**
1. 
2. 
3. 

**Test Results:**
- [ ] All tests passed ✅
- [ ] Manual testing successful ✅

## 🔄 Related Issues / Tasks
Link any related issues, tasks, or tickets:
- Related to Task # in DEVELOPMENT_TASKS.md
- Closes #
- Depends on #

## 📸 Screenshots / Recordings
Add screenshots, console logs, or screen recordings:

### Screenshots
[Attach screenshots here]

### Console Logs
```
[Paste relevant console logs]
```

### Screen Recording
[Link to video or attach file]

## 📦 Deliverables Checklist
- [ ] All acceptance criteria met
- [ ] Screenshots/logs attached
- [ ] Documentation updated (if needed)
- [ ] Tests added/updated (if applicable)
- [ ] No breaking changes
- [ ] Ready for review

## ✅ Pre-Merge Checklist
- [ ] My code follows the project's coding standards
- [ ] I have tested my changes thoroughly
- [ ] I have rebased on latest `main`
- [ ] No console errors or warnings
- [ ] Documentation updated where necessary
- [ ] Commit messages are clear and descriptive

## 💬 Additional Notes
[Any additional context, concerns, or notes for reviewers]

---

**Reviewer:** Please verify all acceptance criteria before approving ✅

Thank you for your contribution! 🙌
```

---

## 1️⃣1️⃣ Example Workflow

### Alex's Task: Cairo Contracts Build & Test

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/alex-cairo-build-tests

# 3. Work on task
cd /home/daniel/Documents/augment-projects/Memorabilia
sozo clean
sozo build
sozo test

# 4. Commit changes
git add .
git commit -m "feat: fix Cairo contract compilation errors"
git commit -m "test: add unit tests for game_system"

# 5. Rebase before pushing
git fetch origin
git rebase origin/main

# 6. Push and create PR
git push -u origin feature/alex-cairo-build-tests

# 7. On GitHub: Create PR with template
# - Add screenshots of successful build
# - Add test results
# - Request review

# 8. After approval and merge
git checkout main
git pull origin main
git branch -d feature/alex-cairo-build-tests
```

---

## 1️⃣2️⃣ Team Communication

### Daily Standup (Async)
Post in team chat:
- ✅ What I completed yesterday
- 🔄 What I'm working on today
- 🚧 Any blockers

### PR Reviews
- Review PRs within 24 hours
- Provide constructive feedback
- Approve if all criteria met
- Request changes if needed

### Coordination
- Announce when starting a task
- Share World address (Task 3)
- Share bot links (Task 2)
- Share SDK updates (Task 5)

---

## 1️⃣3️⃣ Troubleshooting

### "Your branch is behind 'origin/main'"
```bash
git fetch origin
git rebase origin/main
git push --force-with-lease
```

### "Merge conflict during rebase"
```bash
# 1. Open conflicted files in editor
# 2. Resolve conflicts (remove <<<, ===, >>> markers)
# 3. Stage resolved files
git add <resolved-files>
# 4. Continue rebase
git rebase --continue
```

### "Accidentally committed to main"
```bash
# 1. Create feature branch from current state
git checkout -b feature/<yourName>-<task>
# 2. Reset main to origin
git checkout main
git reset --hard origin/main
# 3. Continue work on feature branch
git checkout feature/<yourName>-<task>
```

### "Need to update PR with new changes"
```bash
# 1. Make changes
git add .
git commit -m "fix: address review comments"
# 2. Rebase on latest main
git fetch origin
git rebase origin/main
# 3. Force push (safe because it's your branch)
git push --force-with-lease
```

---

## 1️⃣4️⃣ Best Practices

✅ **Commit often** - Small, focused commits  
✅ **Write clear messages** - Explain what and why  
✅ **Test before pushing** - Verify your changes work  
✅ **Keep PRs small** - One task per PR  
✅ **Review promptly** - Help unblock teammates  
✅ **Communicate** - Share updates and blockers  
✅ **Document** - Update docs with your changes  
✅ **Rebase, don't merge** - Keep history clean  

---

## 1️⃣5️⃣ Quick Reference

| Action | Command |
|--------|---------|
| Update main | `git checkout main && git pull origin main` |
| Create branch | `git checkout -b feature/<name>-<task>` |
| Commit | `git add . && git commit -m "message"` |
| Rebase | `git fetch origin && git rebase origin/main` |
| Push | `git push -u origin feature/<name>-<task>` |
| Update PR | `git push --force-with-lease` |
| Delete branch | `git branch -d feature/<name>-<task>` |

---

## 🎯 Success Metrics

- ✅ All PRs reviewed within 24 hours
- ✅ No direct commits to `main`
- ✅ All PRs include acceptance criteria
- ✅ Clean, linear git history
- ✅ Zero merge conflicts
- ✅ All tasks completed on time

---

**Let's build Memorabilia together! 🚀**

For questions about the workflow, ask in team chat or review this document.

