export interface PRFile {
  filename: string;
  patch?: string;
  additions: number;
  deletions: number;
  status: string;
}

export interface Finding {
  filename: string;
  line: number;
  severity: 'GHOST' | 'ZOMBIE' | 'SLASHER' | 'VAMPIRE' | 'MONSTER';
  message: string;
  suggestion: string;
}

export interface HookContext {
  findings: Finding[];
  repo: string;
  prNumber: number;
  githubToken: string;
  sortedFindings?: Finding[];
  reviewPosted?: boolean;
}
