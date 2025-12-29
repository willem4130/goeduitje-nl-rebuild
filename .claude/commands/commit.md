---
name: commit
description: Run checks, commit with AI message, and push to FRONTEND repo
---

⚠️ **FRONTEND REPO ONLY** - For backend changes, use backend repo's /commit

1. Run quality checks:

   ```bash
   bun run typecheck && bun run lint && bun run format:check
   ```

   Fix ALL errors before continuing.

2. Review changes: `git status` and `git diff`

3. Generate commit message following Conventional Commits:
   - Format: `type: description`
   - Types: feat/fix/docs/style/refactor/test/chore
   - Be specific and concise (one line)
   - Example: `feat: add workshop configurator form validation`

4. Commit and push to **FRONTEND** repo (https://github.com/willem4130/goeduitje-nl-rebuild.git):
   ```bash
   git add -A
   git commit -m "[your generated message]"
   git push origin main
   ```
