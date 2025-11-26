# Setting Up npm Trusted Publishers

This guide will help you set up npm Trusted Publishers for automated publishing from GitHub Actions.

## What are Trusted Publishers?

Trusted Publishers allow you to publish npm packages from GitHub Actions **without storing npm tokens as secrets**. This is more secure and follows npm's recommended best practices.

## Benefits

- ✅ **More Secure**: Uses OIDC (OpenID Connect) authentication
- ✅ **No Secrets**: No need to store npm tokens in GitHub secrets
- ✅ **Automatic**: Publishes automatically when you create a GitHub Release
- ✅ **Provenance**: Includes provenance attestation for package security

## Setup Steps

### Step 1: Create npm Account (if needed)

1. Go to https://www.npmjs.com/signup
2. Create your account
3. Verify your email

### Step 2: Set Up Trusted Publisher

1. **Go to Trusted Publishers page**:
   - Visit: https://www.npmjs.com/settings/YOUR_USERNAME/trusted-publishers
   - Or: npm.com → Your Profile → Access Tokens → Trusted Publishers

2. **Add GitHub Actions as Trusted Publisher**:
   - Click "Add Trusted Publisher"
   - Select "GitHub Actions"
   - Enter:
     - **GitHub Username**: `akhildesai20`
     - **Repository**: `sentence-highlighter`
   - Click "Add"

3. **Verify Setup**:
   - You should see your repository listed under Trusted Publishers

### Step 3: Verify Workflow

The GitHub Actions workflow (`.github/workflows/publish-npm.yml`) is already configured to use trusted publishers.

It will automatically:
- Publish when you create a GitHub Release
- Include provenance attestation
- Use OIDC authentication (no tokens needed)

### Step 4: Test Publishing

**Option A: Create a GitHub Release**
1. Go to: https://github.com/akhildesai20/sentence-highlighter/releases/new
2. Create a new release with tag `v2.0.0`
3. The workflow will automatically publish to npm

**Option B: Manual Trigger**
1. Go to: https://github.com/akhildesai20/sentence-highlighter/actions
2. Select "Publish to npm" workflow
3. Click "Run workflow"

## First-Time Manual Publish (Alternative)

If you prefer to publish manually the first time:

```bash
# Login to npm
npm login

# Verify package
npm pack --dry-run

# Build
npm run build

# Publish
npm publish --access public
```

## Troubleshooting

### "403 Forbidden" Error

- Make sure trusted publisher is set up correctly
- Verify GitHub username and repository name match exactly
- Check that the workflow has `id-token: write` permission (already configured)

### "Package name already exists"

- Check if the package name is available: https://www.npmjs.com/package/@akhildesai20/sentencehighlighter
- Package is published as: `@akhildesai20/sentencehighlighter`

### Workflow Not Triggering

- Make sure you're creating a GitHub Release (not just a tag)
- Check workflow permissions in repository settings
- Verify the workflow file is in `.github/workflows/`

## Resources

- **npm Trusted Publishers Docs**: https://docs.npmjs.com/trusted-publishers
- **GitHub Actions Setup**: https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages
- **Provenance**: https://docs.npmjs.com/generating-provenance-statements

## Next Steps

After setting up trusted publishers:

1. ✅ Create a GitHub Release for v2.0.0
2. ✅ The package will automatically publish to npm
3. ✅ Share your package: `npm install @akhildesai20/sentencehighlighter`

---

**Need Help?** Check the [PUBLISH.md](./PUBLISH.md) file for more details.

