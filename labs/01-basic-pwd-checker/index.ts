/**
 * Lab 01 — Basic Password Checker
 *
 * Uses zxcvbn (Dropbox's offline password strength estimator) to evaluate
 * password strength without any API calls. Demonstrates a self-contained
 * local analysis: scoring, crack time estimate, and actionable feedback.
 *
 * Run:
 *   npx ts-node labs/01-basic-pwd-checker/index.ts [password]
 *
 * Example:
 *   npx ts-node labs/01-basic-pwd-checker/index.ts "hunter2"
 */

import zxcvbn from 'zxcvbn';

const STRENGTH_LABELS: Record<number, string> = {
  0: 'Very Weak',
  1: 'Weak',
  2: 'Fair',
  3: 'Strong',
  4: 'Very Strong',
};

function checkPassword(password: string): void {
  const result = zxcvbn(password);

  const score = result.score;
  const label = STRENGTH_LABELS[score];
  const crackTime = result.crack_times_display.offline_slow_hashing_1e4_per_second;
  const suggestions = result.feedback.suggestions;
  const warning = result.feedback.warning;

  console.log(`\nStrength:   ${label} (${score}/4)`);
  console.log(`Crack time: ${crackTime} (offline, slow hash)`);

  if (warning) {
    console.log(`\nWarning: ${warning}`);
  }

  if (suggestions.length > 0) {
    console.log('\nSuggestions:');
    suggestions.forEach((s) => console.log(`  • ${s}`));
  }

  console.log();
}

const password = process.argv[2];

if (!password) {
  console.error('Usage: npx ts-node labs/01-basic-pwd-checker/index.ts <password>');
  process.exit(1);
}

checkPassword(password);