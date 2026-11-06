import type { Finding } from '../types';

const SEVERITY_EMOJI: Record<Finding['severity'], string> = {
  GHOST: '👻',
  ZOMBIE: '🧟',
  SLASHER: '🔪',
  VAMPIRE: '🧛',
  MONSTER: '💀',
};

function formatComment(f: Finding): string {
  const emoji = SEVERITY_EMOJI[f.severity];
  return [
    `${emoji} **${f.severity}** — *A creature stirs in \`${f.filename}\`.*`,
    '',
    f.message,
    '',
    `**Fix:** ${f.suggestion}`,
  ].join('\n');
}

function formatSummary(findings: Finding[]): string {
  const counts = findings.reduce(
    (acc, f) => ({ ...acc, [f.severity]: (acc[f.severity] ?? 0) + 1 }),
    {} as Record<string, number>
  );

  const lines = Object.entries(counts).map(
    ([sev, n]) => `- ${n}x ${SEVERITY_EMOJI[sev as Finding['severity']]} ${sev}`
  );

  return [
    '🕯️ *NightmareDiff has completed its haunting of this PR.*',
    '',
    'The following horrors were found lurking in your diff:',
    ...lines,
    '',
    'Exorcise these demons before merging, or they will follow you to production.',
    '',
    '— **NightmareDiff** 🕯️',
  ].join('\n');
}

export async function postReview(
  token: string,
  repo: string,
  prNumber: number,
  findings: Finding[]
): Promise<void> {
  const url = `https://api.github.com/repos/${repo}/pulls/${prNumber}/reviews`;

  const comments = findings.map(f => ({
    path: f.filename,
    line: f.line,
    side: 'RIGHT',
    body: formatComment(f),
  }));

  const body = {
    body: formatSummary(findings),
    event: 'COMMENT',
    comments,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to post review: ${res.status} ${text}`);
  }
}
