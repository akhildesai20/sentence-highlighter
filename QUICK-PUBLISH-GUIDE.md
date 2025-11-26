# Quick Publish Guide - You're Almost There! 🚀

Since you've already:
- ✅ Created npm account
- ✅ Connected GitHub

Now you just need to set up the **Trusted Publisher** and you're ready to publish!

## Step 1: Set Up Trusted Publisher (2 minutes)

1. **Go to npm Trusted Publishers**:
   - Direct link: https://www.npmjs.com/settings/akhildesai20/trusted-publishers
   - Or: npm.com → Your Profile → Access Tokens → Trusted Publishers

2. **Add GitHub Actions**:
   - Click **"Add Trusted Publisher"**
   - Select **"GitHub Actions"**
   - Enter:
     - **GitHub Username**: `akhildesai20`
     - **Repository**: `sentence-highlighter`
   - Click **"Add"**

3. **Verify**: You should see `akhildesai20/sentence-highlighter` listed

## Step 2: Publish to npm

You have **two options**:

### Option A: Automatic (Recommended) ✨

**Create a GitHub Release** and it will auto-publish:

1. Go to: https://github.com/akhildesai20/sentence-highlighter/releases/new
2. **Tag**: Select `v2.0.0` (already created)
3. **Title**: `Release v2.0.0 - Major Refactor`
4. **Description**: Copy from `RELEASE_NOTES_v2.0.0.md`
5. Click **"Publish release"**
6. ✅ The workflow will automatically publish to npm!

### Option B: Manual Publish (First Time)

If you want to publish manually first:

```bash
# Make sure you're logged in
npm login

# Verify package
npm pack --dry-run

# Build
npm run build

# Publish
npm publish --access public
```

## Step 3: Verify Publication

After publishing, check:
- **npm**: https://www.npmjs.com/package/sentence-highlighter
- **Install**: `npm install sentence-highlighter`

## That's It! 🎉

Your package will be available at:
- **npm**: `npm install sentence-highlighter`
- **unpkg**: `https://unpkg.com/sentence-highlighter@latest/sentence-highlighter.min.js`
- **jsDelivr**: `https://cdn.jsdelivr.net/npm/sentence-highlighter@latest/sentence-highlighter.min.js`

---

**Need help?** Check `SETUP-TRUSTED-PUBLISHERS.md` for detailed instructions.

