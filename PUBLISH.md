# Publishing Guide

This guide explains how to publish the Sentence Highlighter library to npm and other platforms.

## Prerequisites

1. **npm account**: Create one at https://www.npmjs.com/signup
2. **Login to npm**: Run `npm login` in your terminal
3. **Verify package.json**: Make sure all details are correct

## Publishing to npm

### Step 1: Verify Package

```bash
# Check what will be published
npm pack --dry-run

# Verify package.json
npm publish --dry-run
```

### Step 2: Build Minified Version

```bash
npm run build
```

This creates/updates `sentence-highlighter.min.js`.

### Step 3: Publish

```bash
npm publish
```

For the first time, this will publish version 2.0.0.

### Step 4: Verify Publication

Check your package at:
- https://www.npmjs.com/package/sentence-highlighter

## Updating Versions

When making changes:

1. **Update version** in `package.json`:
   ```bash
   npm version patch  # 2.0.0 -> 2.0.1
   npm version minor  # 2.0.0 -> 2.1.0
   npm version major  # 2.0.0 -> 3.0.0
   ```

2. **Update CHANGELOG.md** with new changes

3. **Create git tag**:
   ```bash
   git tag -a v2.0.1 -m "Release v2.0.1: Description"
   git push origin v2.0.1
   ```

4. **Build and publish**:
   ```bash
   npm run build
   npm publish
   ```

## CDN Distribution

After publishing to npm, your package will be available on:

- **unpkg**: `https://unpkg.com/sentence-highlighter@latest/sentence-highlighter.min.js`
- **jsDelivr**: `https://cdn.jsdelivr.net/npm/sentence-highlighter@latest/sentence-highlighter.min.js`

You can also use GitHub as CDN:
- `https://cdn.jsdelivr.net/gh/akhildesai20/sentence-highlighter@main/sentence-highlighter.min.js`

## GitHub Pages

The GitHub Pages workflow is already set up. After pushing to main:

1. Go to repository Settings > Pages
2. Select source: "GitHub Actions"
3. The demo will be available at: `https://akhildesai20.github.io/sentence-highlighter/`

## Checklist Before Publishing

- [ ] Version number updated in `package.json`
- [ ] `CHANGELOG.md` updated
- [ ] All tests pass (if any)
- [ ] Minified version built (`npm run build`)
- [ ] README is up to date
- [ ] License file included
- [ ] Git tag created and pushed
- [ ] No sensitive information in code

## Troubleshooting

### "You do not have permission to publish"

- Make sure you're logged in: `npm whoami`
- Check if package name is taken: https://www.npmjs.com/package/sentence-highlighter
- If taken, you may need to use a scoped package: `@yourusername/sentence-highlighter`

### "Package name already exists"

The package name might be taken. Check availability or use a scoped name.

### Build fails

Make sure you have Node.js installed and the build script works locally.

## Post-Publishing

After successful publication:

1. Update README with npm installation instructions
2. Add npm badge to README
3. Announce on social media/LinkedIn
4. Update any documentation sites

---

**Note**: Once published, you cannot unpublish a package easily. Make sure everything is correct before publishing!

