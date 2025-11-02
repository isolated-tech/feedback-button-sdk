# Release Process

This document describes how to release new versions of `@pullreque.st/button` to npm and GitHub.

## Prerequisites

Before you can create releases, you need to configure the following:

### 1. npm Token

Create an npm token and add it to your GitHub repository secrets:

1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Click on your profile → "Access Tokens" → "Generate New Token"
3. Choose "Automation" token type
4. Copy the generated token
5. Go to your GitHub repository → Settings → Secrets and variables → Actions
6. Click "New repository secret"
7. Name: `NPM_TOKEN`
8. Value: paste your npm token
9. Click "Add secret"

### 2. (Optional) CDN Upload Token

If you want to automatically upload builds to Vercel Blob CDN:

1. Get your Vercel Blob token
2. Add it as a GitHub secret named `VERCEL_BLOB_TOKEN`

## Creating a Release

The release process is fully automated using GitHub Actions. There are two ways to create a release:

### Option 1: Using npm Scripts (Recommended)

Use the built-in npm version commands which will automatically:
- Update the version in package.json
- Create a git commit
- Create a git tag
- Push the tag to GitHub (which triggers the release workflow)

```bash
# For a patch release (0.1.8 → 0.1.9)
npm run release:patch

# For a minor release (0.1.8 → 0.2.0)
npm run release:minor

# For a major release (0.1.8 → 1.0.0)
npm run release:major
```

### Option 2: Manual Version Bump

If you prefer to control the version manually:

```bash
# 1. Update version in package.json manually or use npm version
npm version 0.1.9 --no-git-tag-version

# 2. Commit the change
git add package.json package-lock.json
git commit -m "chore: bump version to 0.1.9"

# 3. Create and push the tag
git tag v0.1.9
git push origin main --tags
```

## What Happens During Release

When you push a version tag (e.g., `v0.1.9`), the GitHub Actions workflow will:

1. **Checkout the code** at that tag
2. **Install dependencies** (`npm ci`)
3. **Run tests** (`npm test`) - release will fail if tests don't pass
4. **Build the package** (`npm run build`)
5. **Verify version** - ensures package.json version matches the tag
6. **Create GitHub Release** - creates a release on GitHub with release notes
7. **Publish to npm** - publishes the package to npm with provenance
8. **Upload to CDN** (optional) - if configured, uploads build artifacts

## Pre-release Versions

To create a pre-release (alpha, beta, or release candidate):

```bash
# For alpha versions
npm version 0.2.0-alpha.1
git push --follow-tags

# For beta versions
npm version 0.2.0-beta.1
git push --follow-tags

# For release candidates
npm version 0.2.0-rc.1
git push --follow-tags
```

Pre-release versions will be marked as "pre-release" on GitHub.

## Rollback

If you need to rollback a release:

```bash
# Deprecate the problematic version on npm
npm deprecate @pullreque.st/button@0.1.9 "This version has critical bugs, please upgrade to 0.1.10"

# Then release a new version with the fix
npm run release:patch
```

## Safety Features

The release workflow includes several safety checks:

- **Version validation**: Ensures package.json version matches the git tag
- **Tests must pass**: Release fails if tests don't pass
- **Build must succeed**: Release fails if build fails
- **Provenance**: npm packages are published with provenance for supply chain security

## Troubleshooting

### Release workflow fails with "version mismatch"

Make sure the version in package.json matches your git tag (without the 'v' prefix):
- Git tag: `v0.1.9`
- package.json: `"version": "0.1.9"`

### npm publish fails with authentication error

Check that your `NPM_TOKEN` secret is properly configured in GitHub repository settings.

### GitHub release is not created

Check that the workflow has `contents: write` permission. This is already configured in the workflow file.

## Monitoring Releases

- View releases on GitHub: https://github.com/isolated-tech/feedback-button-sdk/releases
- View package on npm: https://www.npmjs.com/package/@pullreque.st/button
- Monitor workflow runs: https://github.com/isolated-tech/feedback-button-sdk/actions
