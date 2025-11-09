# 🚀 Git Quick Reference - CurioApp

## 📋 Daily Commands

```bash
# Check status
git status

# Stage & commit changes  
git add .
git commit -m "✨ Your message"
git push origin master

# Pull latest changes
git pull origin master
```

## 🔄 Restore to Baseline

```bash
# RESTORE TO BEAUTIFUL DESIGN BASELINE
git checkout master
git reset --hard 3f72836
git clean -fd

# Alternative: Reset to latest
git reset --hard HEAD
```

## 🌿 Branch Workflow

```bash
# Create & switch to new branch
git checkout -b feature/new-feature

# Switch branches
git checkout master
git checkout feature/new-feature

# Merge & cleanup
git checkout master
git merge feature/new-feature  
git branch -d feature/new-feature
```

## 💾 Commit Message Examples

```bash
git commit -m "✨ Add new interactive story cards"
git commit -m "🐛 Fix audio playback on iOS"  
git commit -m "🎨 Update card shapes to paint palettes"
git commit -m "📱 Optimize for mobile performance"
git commit -m "🎵 Add new lullaby songs"
git commit -m "📚 Update documentation"
```

## 🆘 Emergency Recovery

```bash
# Find lost work
git reflog

# Recover specific commit  
git checkout abc1234
git checkout -b recovery-branch

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

## 🎯 CurioApp Baseline Info

- **Baseline Commit**: `3f72836`
- **Description**: 🎨 Beautiful Design Complete  
- **Repository**: https://github.com/LuochuanYi/CurioApp.git
- **Features**: All shapes, audio, mobile deployment ready

## 📞 Quick Help

```bash
git help <command>    # Get help for any command
git log --oneline     # View commit history  
git diff              # See what changed
git clean -n          # Preview what will be cleaned
git stash             # Save work temporarily
git stash pop         # Restore stashed work
```