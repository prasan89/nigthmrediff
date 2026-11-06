import type { PRFile, Finding } from '../types';

const MAX_FINDINGS = 20;

// Patterns mapped to severity and message templates
const RULES: Array<{
  pattern: RegExp;
  severity: Finding['severity'];
  message: (match: string) => string;
  suggestion: string;
}> = [
  {
    pattern: /console\.log\(/,
    severity: 'GHOST',
    message: () => '`console.log` left in production code — a ghost whispering secrets to the void.',
    suggestion: 'Remove debug logs or replace with a proper logger.',
  },
  {
    pattern: /TODO|FIXME|HACK/,
    severity: 'ZOMBIE',
    message: (m) => `\`${m}\` comment found — undead technical debt shambling through the codebase.`,
    suggestion: 'Resolve or create a tracked issue before merging.',
  },
  {
    pattern: /password\s*=\s*['"][^'"]+['"]/i,
    severity: 'MONSTER',
    message: () => 'Hardcoded password detected — an ancient curse that will haunt you in breach reports.',
    suggestion: 'Move credentials to environment variables or a secrets manager.',
  },
  {
    pattern: /api[_-]?key\s*=\s*['"][^'"]+['"]/i,
    severity: 'MONSTER',
    message: () => 'Hardcoded API key — a monster waiting to be harvested by attackers.',
    suggestion: 'Use environment variables: `process.env.API_KEY`.',
  },
  {
    pattern: /eval\s*\(/,
    severity: 'MONSTER',
    message: () => '`eval()` — a portal to the underworld. Arbitrary code execution risk.',
    suggestion: 'Remove `eval`. Parse data with `JSON.parse` or safer alternatives.',
  },
  {
    pattern: /\.innerHTML\s*=/,
    severity: 'VAMPIRE',
    message: () => '`innerHTML` assignment — a vampire that may drain your app via XSS.',
    suggestion: 'Use `textContent` for plain text, or sanitize HTML with DOMPurify.',
  },
  {
    pattern: /new\s+Promise\s*\(\s*\(resolve,\s*reject\)\s*=>/,
    severity: 'GHOST',
    message: () => 'Unnecessary Promise constructor wrapping an already-async operation.',
    suggestion: 'Use `async/await` directly — the Promise wrapper is a ghost of older patterns.',
  },
  {
    pattern: /catch\s*\([^)]*\)\s*\{\s*\}/,
    severity: 'SLASHER',
    message: () => 'Empty catch block — errors silently devoured, leaving no trace of the slaughter.',
    suggestion: 'Log the error or rethrow: `catch (e) { console.error(e); throw e; }`',
  },
  {
    pattern: /==[^=]/,
    severity: 'SLASHER',
    message: () => 'Loose equality `==` — a shape-shifter that will betray you with type coercion.',
    suggestion: 'Use strict equality `===` instead.',
  },
  {
    pattern: /SELECT\s+\*\s+FROM/i,
    severity: 'VAMPIRE',
    message: () => '`SELECT *` — a vampire query draining your database of unnecessary columns.',
    suggestion: 'Select only the columns you need.',
  },
];

function extractLineNumber(patch: string, matchIndex: number): number {
  const lines = patch.substring(0, matchIndex).split('\n');
  const hunkHeader = lines.reverse().find(l => l.startsWith('@@'));
  if (!hunkHeader) return 1;
  const match = hunkHeader.match(/@@ -\d+(?:,\d+)? \+(\d+)/);
  return match ? parseInt(match[1], 10) + lines.length - 1 : 1;
}

export function analyzeFiles(files: PRFile[]): Finding[] {
  const findings: Finding[] = [];

  for (const file of files) {
    if (!file.patch) continue;

    for (const rule of RULES) {
      const matches = [...file.patch.matchAll(new RegExp(rule.pattern, 'gi'))];
      for (const match of matches) {
        if (findings.length >= MAX_FINDINGS) return findings;
        findings.push({
          filename: file.filename,
          line: extractLineNumber(file.patch, match.index ?? 0),
          severity: rule.severity,
          message: rule.message(match[0]),
          suggestion: rule.suggestion,
        });
      }
    }
  }

  return findings;
}
