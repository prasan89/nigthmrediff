# Spec: NightmareDiff PR Reviewer

## Overview
An autonomous agent that fetches a GitHub Pull Request diff and reviews it for bugs, security issues, performance problems, and code smells. Each finding is classified by horror severity tier and posted as an inline GitHub review comment.

## Inputs
- `GITHUB_TOKEN`: Personal access token with `repo` scope
- `GITHUB_REPO`: Repository in `owner/repo` format
- `PR_NUMBER`: Pull request number to review

## Steps

1. **Fetch PR diff**
   - Call GitHub API `GET /repos/{owner}/{repo}/pulls/{pull_number}/files`
   - Extract filename, patch (diff), and additions/deletions for each file

2. **Analyze each file**
   - For each changed file, analyze the diff patch for:
     - Bugs: null dereference, off-by-one, unchecked return values
     - Security: hardcoded secrets, SQL injection, XSS, unsafe deserialization
     - Performance: N+1 queries, unbounded loops, memory leaks
     - Dead code: unreachable branches, unused variables
     - Deprecated APIs: known deprecated patterns or libraries

3. **Classify findings by severity**
   - 👻 GHOST — dead code, unreachable logic
   - 🧟 ZOMBIE — deprecated API or undead dependency
   - 🔪 SLASHER — bug that will cause a runtime failure
   - 🧛 VAMPIRE — silent performance drain or memory issue
   - 💀 MONSTER — critical security vulnerability

4. **Post review comments**
   - Call GitHub API `POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews`
   - Post one inline comment per finding at the relevant line
   - Use horror-themed language (see steering/horror-tone.md)
   - Include: severity label, explanation, suggested fix

5. **Post summary comment**
   - After all inline comments, post a top-level review summary
   - List total findings by severity tier
   - Sign off as "NightmareDiff 🕯️"

## Constraints
- Skip binary files and generated files (e.g. `*.lock`, `dist/`, `*.min.js`)
- Max 20 findings per PR to avoid comment spam
- Never post a finding without a concrete line reference
