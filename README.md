# NightmareDiff 🕯️

> *An autonomous Kiro-powered code review agent that hunts the scary parts of your PRs — exposing risky logic, hidden bugs, and code smells before they become monsters in production.*

Built for [Kiroween 2026](https://kiroween.devpost.com/) — Category: **Frankenstein**

---

## What it does

NightmareDiff autonomously reviews GitHub Pull Request diffs and classifies findings into five horror-themed severity tiers:

| Severity | Emoji | Meaning |
|---|---|---|
| GHOST | 👻 | Dead code, unreachable logic |
| ZOMBIE | 🧟 | Deprecated APIs, undead dependencies |
| SLASHER | 🔪 | Bugs that will cause runtime failures |
| VAMPIRE | 🧛 | Silent performance or memory drains |
| MONSTER | 💀 | Critical security vulnerabilities |

It posts inline review comments directly on the PR, pinpointing the exact line and suggesting a fix — in the voice of a gothic horror narrator.

---

## How Kiro is used

- **`.kiro/specs/pr-reviewer.md`** — Spec-driven definition of the review agent's behavior: what to fetch, how to analyze, how to classify, and how to post results
- **`.kiro/steering/horror-tone.md`** — Steering doc that shapes all agent output into horror-themed language while keeping technical accuracy
- **`.kiro/hooks/post-review.ts`** — Hook that fires after analysis completes: sorts findings by severity before posting
- **Kiro CLI** — Used to drive the autonomous review agent loop via `kiro-cli chat` with the spec

---

## Setup

### Prerequisites
- Node.js 20+
- GitHub Personal Access Token with `repo` scope
- Kiro CLI: `curl -fsSL https://cli.kiro.dev/install | bash`

### Install
```bash
git clone https://github.com/YOUR_USERNAME/nightmarediff
cd nightmarediff
npm install
```

### Run manually
```bash
export GITHUB_TOKEN=ghp_your_token
export GITHUB_REPO=owner/repo
export PR_NUMBER=42
npm start
```

### Automated (GitHub Actions)
Push to a repo — NightmareDiff automatically haunts every PR via `.github/workflows/nightmarediff.yml`. No setup needed beyond pushing to GitHub.

---

## Project structure

```
nightmarediff/
├── .kiro/
│   ├── specs/pr-reviewer.md      # Kiro spec
│   ├── hooks/post-review.ts      # Kiro hook
│   └── steering/horror-tone.md   # Kiro steering
├── src/
│   ├── github/
│   │   ├── fetchDiff.ts
│   │   └── postReview.ts
│   ├── agents/reviewer.ts
│   ├── types.ts
│   └── index.ts
└── .github/workflows/nightmarediff.yml
```

---

## License

MIT
