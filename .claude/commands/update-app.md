---
name: update-app
description: Update dependencies, fix deprecations and warnings
---

# Dependency Update & Deprecation Fix

## Step 1: Check for Updates

```bash
bun outdated
```

## Step 2: Update Dependencies

```bash
bun update
```

If there are security vulnerabilities, check them:

```bash
bun audit
```

## Step 3: Check for Deprecations & Warnings

Run installation and check output:

```bash
rm -rf node_modules bun.lockb
bun install
```

Read ALL output carefully. Look for:

- Deprecation warnings
- Security vulnerabilities
- Peer dependency warnings
- Breaking changes

## Step 4: Fix Issues

For each warning/deprecation:

1. Research the recommended replacement or fix
2. Update code/dependencies accordingly
3. Re-run installation
4. Verify no warnings remain

## Step 5: Run Quality Checks

```bash
bun run typecheck
bun run lint
bun run format:check
bun run test
```

Fix all errors before completing.

## Step 6: Verify Clean Install

Ensure a fresh install works:

1. Delete dependency folders/caches:
   ```bash
   rm -rf node_modules bun.lockb
   ```
2. Run clean install:
   ```bash
   bun install
   ```
3. Verify ZERO warnings/errors
4. Confirm all dependencies resolve correctly

## Step 7: Final Validation

Run the dev server to ensure everything works:

```bash
bun run dev
```

Check that the app starts without errors and all features work as expected.
