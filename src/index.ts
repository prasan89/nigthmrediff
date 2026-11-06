import { fetchPRFiles } from './github/fetchDiff';
import { postReview } from './github/postReview';
import { analyzeFiles } from './agents/reviewer';

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const prNumber = parseInt(process.env.PR_NUMBER ?? '0', 10);

  if (!token || !repo || !prNumber) {
    console.error('Required env vars: GITHUB_TOKEN, GITHUB_REPO, PR_NUMBER');
    process.exit(1);
  }

  console.log(`🕯️  NightmareDiff awakens... haunting PR #${prNumber} in ${repo}`);

  const files = await fetchPRFiles(token, repo, prNumber);
  console.log(`📜 ${files.length} files dragged from the grave for inspection.`);

  const findings = analyzeFiles(files);
  console.log(`💀 ${findings.length} horrors discovered.`);

  if (findings.length === 0) {
    console.log('👁️  The code is suspiciously clean. NightmareDiff retreats into the shadows.');
    return;
  }

  await postReview(token, repo, prNumber, findings);
  console.log('🕯️  Review posted. The haunting is complete.');
}

main().catch(err => {
  console.error('NightmareDiff encountered an unrecoverable darkness:', err);
  process.exit(1);
});
