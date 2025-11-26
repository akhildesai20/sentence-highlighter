#!/bin/bash
# Setup script for GitHub repository
# Run this after creating the repository on GitHub

REPO_URL="https://github.com/akhildesai20/sentence-highlighter.git"

echo "Setting up GitHub remote..."
git remote add origin $REPO_URL 2>/dev/null || git remote set-url origin $REPO_URL

echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "Done! Your repository is now on GitHub."
echo "Visit: https://github.com/akhildesai20/sentence-highlighter"

