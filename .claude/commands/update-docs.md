---
description: Analyze recent commits and update documentation accordingly
---

# Update Documentation from Recent Commits

You are tasked with analyzing recent git commits and updating the project documentation in the `docs/` folder.

## Parameters

The user will specify how many commits to analyze (default: 5 if not specified).

## Steps to Follow

### 1. Analyze Recent Commits

Run the following commands to understand recent changes:

```bash
# Get list of last N commits with details
git log -n {N} --pretty=format:"%H|%s|%an|%ar" --name-status

# Get detailed diff for these commits
git log -n {N} -p --stat
```

Replace {N} with the number provided by the user, or use 5 as default.

### 2. Identify Changed Areas

Analyze what was changed:
- New files created
- Existing files modified
- Deleted files
- New features added
- API changes
- Configuration changes
- Component changes
- Architecture changes

### 3. Review Existing Documentation

Read all relevant documentation files in `docs/`:
- `docs/README.md` - main index
- `docs/architecture/*.md` - architecture docs
- `docs/backend/*.md` - backend docs
- `docs/frontend/*.md` - frontend docs

### 4. Find Discrepancies

Compare the code changes with existing documentation:
- Are new features documented?
- Are API endpoints up to date?
- Are component descriptions accurate?
- Are configuration examples current?
- Are new files/modules mentioned?
- Are architectural changes reflected?

### 5. Update Documentation

Based on discrepancies found:

**For Backend Changes:**
- Update `docs/backend/api-endpoints.md` if API endpoints changed
- Update `docs/backend/configuration.md` if config changed
- Update `docs/backend/development.md` if dev workflow changed
- Update `docs/backend/README.md` if structure changed

**For Frontend Changes:**
- Update `docs/frontend/components.md` if components added/changed
- Update `docs/frontend/vite-configuration.md` if Vite config changed
- Update `docs/frontend/development.md` if dev workflow changed
- Update `docs/frontend/README.md` if structure changed

**For Architecture Changes:**
- Update `docs/architecture/overview.md` if overall architecture changed
- Update `docs/architecture/workspace-structure.md` if workspace structure changed
- Update `docs/architecture/communication.md` if API communication changed

**For New Features:**
- Create new documentation files if needed
- Update index files (README.md) to link to new docs
- Add examples and usage instructions

### 6. Summary

Provide a summary of:
- What changes were found in commits
- What documentation was updated
- What new documentation was created
- Any areas that might need manual review

## Important Notes

- Focus on **significant changes** that affect how developers use the codebase
- Don't document trivial changes (typo fixes, formatting, etc.)
- Keep documentation concise and practical
- Include code examples where relevant
- Maintain the existing documentation style and structure
- Update cross-references between documentation files
- Ensure all new API endpoints have examples
- Keep README.md index files up to date with new documentation
- **Documentation is in Russian language** - write all documentation content in Russian
- **File naming convention**:
  - Index files MUST be named `README.md` (uppercase)
  - All other documentation files MUST be lowercase (e.g., `api-endpoints.md`, `components.md`, `vite-configuration.md`)
  - Never create files like `API-Endpoints.md` or `Components.md` - always use lowercase with hyphens

## Output Format

After completing the analysis and updates, provide:

1. **Changes Summary**: What was changed in the commits
2. **Documentation Updates**: List of files updated/created
3. **Key Additions**: Highlight important new documentation
4. **Review Needed**: Any areas requiring manual attention

Start by asking the user how many commits to analyze if not specified, then proceed with the analysis.
