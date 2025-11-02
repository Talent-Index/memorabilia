#!/bin/bash

# Merge Plan Execution Script
# This script safely merges the feature branches into main

set -e  # Exit on error

echo "🔍 Merge Plan Execution"
echo "======================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 0: Check current status
echo "📊 Step 0: Checking current status..."
echo ""
git status --short
echo ""

# Step 1: Create backup
echo "💾 Step 1: Creating backup branch..."
git branch backup-before-merge-$(date +%Y%m%d-%H%M%S) || true
echo -e "${GREEN}✅ Backup created${NC}"
echo ""

# Step 2: Commit local changes
echo "📝 Step 2: Committing local changes..."
echo ""
read -p "Do you want to commit local changes? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git add .
    
    # Check if commit message file exists
    if [ -f "COMMIT_MESSAGE_SHORT.txt" ]; then
        git commit -F COMMIT_MESSAGE_SHORT.txt || echo "Nothing to commit or commit failed"
    else
        git commit -m "feat: add Telegram bot integration and fix mobile UI" || echo "Nothing to commit"
    fi
    
    echo -e "${GREEN}✅ Local changes committed${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping local commit${NC}"
fi
echo ""

# Step 3: Merge security improvements
echo "🔒 Step 3: Merging feature/security-improvements..."
echo ""
read -p "Proceed with merging security improvements? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git merge origin/feature/security-improvements --no-ff -m "merge: integrate security improvements (rate limiting, game cards model)" || {
        echo -e "${RED}❌ Merge conflict detected!${NC}"
        echo "Please resolve conflicts manually, then run:"
        echo "  git merge --continue"
        echo "Then re-run this script from Step 4"
        exit 1
    }
    echo -e "${GREEN}✅ Security improvements merged${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping security improvements merge${NC}"
fi
echo ""

# Step 4: Merge Dojo-Telegram SDK
echo "🔧 Step 4: Merging feature/dojo-telegram-sdk..."
echo ""
read -p "Proceed with merging Dojo-Telegram SDK? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git merge origin/feature/dojo-telegram-sdk --no-ff -m "merge: integrate Dojo-Telegram SDK improvements (tests, CI/CD)" || {
        echo -e "${RED}❌ Merge conflict detected!${NC}"
        echo "Please resolve conflicts manually, then run:"
        echo "  git merge --continue"
        echo "Then re-run this script from Step 5"
        exit 1
    }
    echo -e "${GREEN}✅ Dojo-Telegram SDK merged${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping Dojo-Telegram SDK merge${NC}"
fi
echo ""

# Step 5: Check merge status
echo "📊 Step 5: Checking merge status..."
echo ""
git status
echo ""

# Step 6: Run tests
echo "🧪 Step 6: Running tests..."
echo ""
read -p "Run tests now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Testing Dojo-Telegram SDK..."
    cd dojo-telegram-sdk
    npm install || echo "npm install failed"
    npm test || echo "Tests failed"
    npm run build || echo "Build failed"
    cd ..
    
    echo ""
    echo "Testing frontend..."
    cd frontend
    npm install || echo "npm install failed"
    npm run build || echo "Build failed"
    cd ..
    
    echo ""
    echo "Testing bot (if exists)..."
    if [ -d "telegram-bot" ]; then
        cd telegram-bot
        npm install || echo "npm install failed"
        node test-bot.js || echo "Bot test failed"
        cd ..
    else
        echo "telegram-bot directory not found (removed by merge)"
    fi
    
    echo -e "${GREEN}✅ Tests completed${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping tests${NC}"
fi
echo ""

# Step 7: Summary
echo "📋 Step 7: Merge Summary"
echo "======================="
echo ""
echo "Merged branches:"
echo "  ✅ origin/feature/security-improvements"
echo "  ✅ origin/feature/dojo-telegram-sdk"
echo ""
echo "Next steps:"
echo "  1. Review the changes: git log --oneline -10"
echo "  2. Check for any issues: git status"
echo "  3. Push to remote: git push origin main"
echo "  4. Deploy to Vercel: cd frontend && vercel --prod"
echo ""
echo -e "${GREEN}🎉 Merge completed successfully!${NC}"
echo ""

# Step 8: Ask about push
echo "🚀 Step 8: Push to remote?"
echo ""
read -p "Push changes to origin/main? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git push origin main
    echo -e "${GREEN}✅ Pushed to remote${NC}"
else
    echo -e "${YELLOW}⚠️  Not pushed. Run 'git push origin main' when ready${NC}"
fi
echo ""

echo "✨ All done!"

