# 🚀 CurioApp GitHub Management Guide

## 📋 Repository Information
- **Repository URL**: https://github.com/LuochuanYi/CurioApp.git
- **Owner**: LuochuanYi
- **Current Branch**: master
- **Baseline Commit**: Beautiful Design Complete with all creative shapes and mobile deployment

---

## 🔧 Essential Git Commands

### 📊 Checking Status & History

```bash
# Check current status of your working directory
git status

# View commit history
git log --oneline

# See what files have changed
git diff

# Check which branch you're on
git branch

# View remote repositories
git remote -v
```

---

## 💾 Making Changes & Committing

### 1. **Adding Changes**
```bash
# Add specific files
git add screens/HomeScreen.js
git add components/CurioCard.js

# Add all changed files
git add .

# Add all files with specific extension
git add *.js
```

### 2. **Committing Changes**
```bash
# Commit with a descriptive message
git commit -m "✨ Add new feature: Interactive story cards with sound effects"

# Commit all tracked changes (skip git add for tracked files)
git commit -am "🐛 Fix: Resolve audio playback issue on iOS devices"

# Detailed commit with multiple lines
git commit -m "🎨 Redesign: Update card shapes for better user experience

- Changed square cards to opened book shapes for stories
- Added paint palette shapes for learning categories  
- Implemented transparent backgrounds (25% opacity)
- Enhanced accessibility with proper labels"
```

### 3. **Pushing to GitHub**
```bash
# Push to main branch (standard)
git push origin master

# Force push (use carefully!)
git push --force origin master

# Push and set upstream tracking
git push -u origin master
```

---

## 🔄 Restoring & Rolling Back

### **Restore to Baseline (Complete Reset)**
```bash
# WARNING: This will lose ALL uncommitted changes!
git checkout master
git reset --hard HEAD
git clean -fd

# Alternative: Reset to specific commit (baseline)
git reset --hard 3f72836  # Your baseline commit hash
```

### **Restore Specific Files**
```bash
# Restore single file to last committed version
git checkout -- screens/HomeScreen.js

# Restore multiple files
git checkout -- screens/ components/

# Restore file to specific commit
git checkout 3f72836 -- screens/HomeScreen.js
```

### **Undo Last Commit (Keep Changes)**
```bash
# Undo last commit but keep changes in working directory
git reset --soft HEAD~1

# Undo last commit and unstage changes
git reset HEAD~1

# Undo last commit and discard changes (DANGEROUS!)
git reset --hard HEAD~1
```

---

## 🌿 Branch Management

### **Creating & Switching Branches**
```bash
# Create new branch from current position
git checkout -b feature/new-audio-system

# Create branch from specific commit
git checkout -b hotfix/ios-bug 3f72836

# Switch to existing branch
git checkout master
git checkout feature/new-audio-system

# List all branches
git branch -a
```

### **Merging Branches**
```bash
# Switch to target branch (usually master)
git checkout master

# Merge feature branch
git merge feature/new-audio-system

# Delete merged branch
git branch -d feature/new-audio-system
```

---

## 📥 Syncing with GitHub

### **Pulling Changes**
```bash
# Pull latest changes from GitHub
git pull origin master

# Fetch changes without merging
git fetch origin

# Pull with rebase (cleaner history)
git pull --rebase origin master
```

### **Handling Conflicts**
```bash
# If merge conflicts occur:
# 1. Edit conflicted files manually
# 2. Mark as resolved
git add conflicted-file.js

# 3. Complete the merge
git commit -m "🔀 Resolve merge conflict in audio system"
```

---

## 🏷️ Tagging Releases

### **Creating Tags**
```bash
# Create lightweight tag
git tag v1.0.0

# Create annotated tag with message
git tag -a v1.0.0 -m "🎉 Release 1.0.0: Beautiful CurioApp Baseline"

# Tag specific commit
git tag -a v1.0.0 3f72836 -m "🎨 Baseline: Complete UI Design"

# Push tags to GitHub
git push origin --tags
```

---

## 🔍 Advanced Operations

### **Stashing Changes**
```bash
# Save current changes temporarily
git stash

# Save with message
git stash push -m "WIP: Implementing new card animations"

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{1}
```

### **Cherry-picking Commits**
```bash
# Apply specific commit to current branch
git cherry-pick abc1234

# Cherry-pick multiple commits
git cherry-pick abc1234 def5678
```

---

## 📋 Common Workflows

### **Feature Development Workflow**
```bash
# 1. Start from clean master
git checkout master
git pull origin master

# 2. Create feature branch
git checkout -b feature/interactive-stories

# 3. Make changes and commit frequently
git add .
git commit -m "✨ Add story interaction framework"

# 4. Push feature branch
git push -u origin feature/interactive-stories

# 5. When ready, merge to master
git checkout master
git merge feature/interactive-stories
git push origin master

# 6. Clean up
git branch -d feature/interactive-stories
```

### **Hotfix Workflow**
```bash
# 1. Create hotfix from master
git checkout master
git checkout -b hotfix/audio-crash-fix

# 2. Fix the issue
git add .
git commit -m "🐛 Fix: Resolve audio crash on song transition"

# 3. Merge back to master
git checkout master
git merge hotfix/audio-crash-fix
git push origin master

# 4. Clean up
git branch -d hotfix/audio-crash-fix
```

---

## 🎯 Commit Message Conventions

Use these emoji prefixes for clear commit messages:

- `✨` `:sparkles:` - New features
- `🐛` `:bug:` - Bug fixes
- `🎨` `:art:` - UI/UX improvements
- `🔧` `:wrench:` - Configuration changes
- `📱` `:iphone:` - Mobile-specific changes
- `🎵` `:musical_note:` - Audio-related changes
- `📚` `:books:` - Documentation updates
- `🚀` `:rocket:` - Performance improvements
- `♻️` `:recycle:` - Code refactoring
- `🔀` `:twisted_rightwards_arrows:` - Merge commits

### Examples:
```bash
git commit -m "✨ Add interactive story narration with voice controls"
git commit -m "🐛 Fix audio playback stuttering on Android devices"  
git commit -m "🎨 Redesign song cards with music note shapes"
git commit -m "📱 Optimize app performance for older iOS devices"
```

---

## 🆘 Emergency Procedures

### **Lost Work Recovery**
```bash
# Find lost commits
git reflog

# Recover specific commit
git checkout abc1234

# Create branch from recovered commit
git checkout -b recovery-branch
```

### **Corrupted Repository**
```bash
# Re-clone from GitHub
cd ..
git clone https://github.com/LuochuanYi/CurioApp.git CurioApp-backup
cd CurioApp-backup

# Copy your uncommitted work if needed
```

### **Wrong Commit on Wrong Branch**
```bash
# Move last commit to correct branch
git checkout correct-branch
git cherry-pick wrong-branch
git checkout wrong-branch
git reset --hard HEAD~1
```

---

## 📊 Repository Maintenance

### **Cleaning Repository**
```bash
# Remove untracked files
git clean -f

# Remove untracked directories too
git clean -fd

# See what would be removed (dry run)
git clean -n
```

### **Checking Repository Health**
```bash
# Verify repository integrity
git fsck

# Optimize repository
git gc

# Check repository size
git count-objects -vH
```

---

## 🔐 Security & Best Practices

### **Protecting Sensitive Data**
- Never commit `.env` files with API keys
- Use `.gitignore` for sensitive configuration files
- Review changes before committing: `git diff --staged`

### **Backup Strategy**
- GitHub serves as your primary backup
- Create tags for important milestones
- Consider multiple remotes for critical projects

### **Collaboration Guidelines**
- Always pull before pushing: `git pull origin master`
- Use descriptive commit messages
- Keep commits focused and atomic
- Test before pushing to master branch

---

## 📞 Quick Reference Commands

```bash
# Daily workflow
git status                    # Check what changed
git add .                     # Stage all changes  
git commit -m "message"       # Commit changes
git push origin master        # Push to GitHub

# Safety commands
git stash                     # Save work temporarily
git checkout -- file.js      # Discard file changes
git reset --hard HEAD         # Reset to last commit

# Branch workflow  
git checkout -b new-feature   # Create & switch to branch
git checkout master           # Switch to master
git merge new-feature         # Merge branch to master
git branch -d new-feature     # Delete merged branch
```

---

## 🎯 Your CurioApp Baseline

**Commit Hash**: `3f72836`  
**Description**: 🎨 Initial CurioApp Baseline - Beautiful Design Complete

**To restore to this exact baseline:**
```bash
git checkout master
git reset --hard 3f72836
git clean -fd
```

**Features in this baseline:**
- ✅ Opened book shapes for stories
- ✅ Paint palette shapes for learning categories  
- ✅ Music list style for songs
- ✅ Transparent backgrounds (25% opacity)
- ✅ iPhone deployment ready
- ✅ Real MP3 audio integration
- ✅ Seamless UI/UX design

---

*This guide covers all essential Git operations for managing your beautiful CurioApp! Keep this as your reference for safe and effective version control.* 🚀