import type { PRFile } from '../types';

const SKIP_PATTERNS = [
  /\.lock$/,
  /^dist\//,
  /\.min\.(js|css)$/,
  /^node_modules\//,
  /\.(png|jpg|gif|svg|ico|woff|woff2|ttf|eot)$/,
];

export async function fetchPRFiles(
  token: string,
  repo: string,
  prNumber: number
): Promise<PRFile[]> {
  const url = `https://api.github.com/repos/${repo}/pulls/${prNumber}/files`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const files: PRFile[] = await res.json();
  return files.filter(f => !SKIP_PATTERNS.some(p => p.test(f.filename)));
}
