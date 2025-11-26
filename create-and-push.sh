#!/bin/bash
# Script to create GitHub repo and push code
# This will open GitHub in your browser with pre-filled repo details

REPO_NAME="sentence-highlighter"
REPO_DESC="A lightweight, zero-dependency JavaScript library for sentence-by-sentence highlighting in contenteditable elements"
GITHUB_USER="akhildesai20"

echo "🚀 Setting up GitHub repository..."
echo ""
echo "Step 1: Creating repository on GitHub..."
echo "Opening GitHub in your browser with pre-filled details..."
echo ""

# Create the repository URL with pre-filled form data
REPO_URL="https://github.com/new?name=${REPO_NAME}&description=${REPO_DESC// /%20}&visibility=public"

# Try to open in browser (works on macOS)
if command -v open > /dev/null; then
    open "$REPO_URL"
    echo "✅ Opened GitHub in your browser"
elif command -v xdg-open > /dev/null; then
    xdg-open "$REPO_URL"
    echo "✅ Opened GitHub in your browser"
else
    echo "Please open this URL in your browser:"
    echo "$REPO_URL"
fi

echo ""
echo "Step 2: After creating the repository, press Enter to push your code..."
read -p "Press Enter when the repository is created on GitHub..."

echo ""
echo "Step 3: Pushing code to GitHub..."
git remote add origin git@github.com:${GITHUB_USER}/${REPO_NAME}.git 2>/dev/null || git remote set-url origin git@github.com:${GITHUB_USER}/${REPO_NAME}.git
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your repository is now on GitHub:"
    echo "   https://github.com/${GITHUB_USER}/${REPO_NAME}"
else
    echo ""
    echo "❌ Push failed. This might be because:"
    echo "   1. The repository doesn't exist yet (make sure you created it)"
    echo "   2. SSH keys aren't set up (try HTTPS instead)"
    echo ""
    echo "Trying HTTPS method..."
    git remote set-url origin https://github.com/${GITHUB_USER}/${REPO_NAME}.git
    git push -u origin main
fi

