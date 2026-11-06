import type { HookContext } from '../src/types';

// Hook: fires after the review agent completes analysis
// Formats findings and triggers GitHub comment posting
export async function onReviewComplete(ctx: HookContext) {
  const { findings, repo, prNumber, githubToken } = ctx;

  if (!findings || findings.length === 0) {
    console.log('NightmareDiff: No horrors found. The code is... suspiciously clean. 👁️');
    return;
  }

  // Sort by severity: MONSTER > VAMPIRE > SLASHER > ZOMBIE > GHOST
  const severityOrder = ['MONSTER', 'VAMPIRE', 'SLASHER', 'ZOMBIE', 'GHOST'];
  const sorted = [...findings].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  ctx.sortedFindings = sorted;
  ctx.reviewPosted = true;
}
