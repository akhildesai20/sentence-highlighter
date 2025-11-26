#!/bin/bash
# Script to publish sentence-highlighter to npm

echo "🚀 Publishing Sentence Highlighter to npm..."
echo ""

# Check if logged in
if ! npm whoami &>/dev/null; then
    echo "❌ Not logged in to npm"
    echo "Please run: npm login"
    echo ""
    echo "You'll need:"
    echo "  - npm account (create at https://www.npmjs.com/signup)"
    echo "  - Username"
    echo "  - Password"
    echo "  - Email"
    exit 1
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

# Verify package
echo "📦 Verifying package..."
npm pack --dry-run

if [ $? -ne 0 ]; then
    echo "❌ Package verification failed"
    exit 1
fi

echo ""
echo "📋 Package contents:"
echo "  - sentence-highlighter.js (main)"
echo "  - sentence-highlighter.min.js (browser)"
echo "  - sentence-highlighter.d.ts (TypeScript)"
echo "  - LICENSE"
echo "  - README.md"
echo ""

# Check if package name is available
echo "🔍 Checking if package name is available..."
PACKAGE_NAME="sentence-highlighter"
if npm view "$PACKAGE_NAME" version &>/dev/null; then
    echo "⚠️  Package '$PACKAGE_NAME' already exists on npm"
    echo "   Current version on npm: $(npm view "$PACKAGE_NAME" version)"
    echo "   Your version: $(node -p "require('./package.json').version")"
    read -p "Continue with publish? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ Package name is available!"
fi

echo ""
read -p "Ready to publish to npm? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Publish cancelled"
    exit 1
fi

echo ""
echo "📤 Publishing to npm..."
npm publish

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully published to npm!"
    echo ""
    echo "📦 Your package is now available at:"
    echo "   https://www.npmjs.com/package/sentence-highlighter"
    echo ""
    echo "📥 Install with:"
    echo "   npm install sentence-highlighter"
    echo ""
    echo "🌐 CDN links (via unpkg/jsDelivr):"
    echo "   https://unpkg.com/sentence-highlighter@latest/sentence-highlighter.min.js"
    echo "   https://cdn.jsdelivr.net/npm/sentence-highlighter@latest/sentence-highlighter.min.js"
else
    echo ""
    echo "❌ Publish failed. Check the error above."
    exit 1
fi

