// Make the AI Judge Laugh — one-line office joke.
// Writes the winning joke to /output/entry.txt and validates it against
// the competition gate (1-200 characters, non-whitespace, single line).

import { mkdirSync, writeFileSync } from "node:fs";

const JOKE =
  "Team building made us build a tower from spaghetti — still the most stable project this company has ever shipped.";

// Gate constants for this competition (see RULES.txt: 1-200 chars, one line).
const MIN_CHARS = 1;
const MAX_CHARS = 200;
const EXPECTED_CHARS = 113;
const EXPECTED_WORDS = 20;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

type GateProblem = { check: string; detail: string };

function findProblems(text: string): GateProblem[] {
  const problems: GateProblem[] = [];
  if (text.trim().length === 0) {
    problems.push({ check: "non-empty", detail: "entry is empty or only whitespace" });
  }
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    problems.push({
      check: "length",
      detail: `entry is ${text.length} characters, gate is ${MIN_CHARS}-${MAX_CHARS}`,
    });
  }
  if (text.length !== EXPECTED_CHARS) {
    problems.push({
      check: "exact-chars",
      detail: `expected ${EXPECTED_CHARS} characters, got ${text.length}`,
    });
  }
  const words = countWords(text);
  if (words !== EXPECTED_WORDS) {
    problems.push({
      check: "word-count",
      detail: `expected ${EXPECTED_WORDS} words, got ${words}`,
    });
  }
  if (text !== text.trim()) {
    problems.push({ check: "no-edge-whitespace", detail: "entry has leading or trailing whitespace" });
  }
  if (text.includes("\n")) {
    problems.push({ check: "single-line", detail: "entry must be a single line" });
  }
  if (/ {2,}/.test(text)) {
    problems.push({ check: "single-spacing", detail: "entry has double spaces" });
  }
  return problems;
}

function enforceGate(text: string): void {
  const problems = findProblems(text);
  if (problems.length > 0) {
    const report = problems.map((p) => `${p.check}: ${p.detail}`).join("; ");
    throw new Error(`gate failed (${problems.length}): ${report}`);
  }
}

enforceGate(JOKE);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", JOKE, "utf8");

// Round-trip check: what the grader reads must be byte-identical to JOKE.
import { readFileSync } from "node:fs";
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== JOKE) {
  throw new Error("round-trip mismatch: /output/entry.txt differs from JOKE");
}

console.log(
  `wrote /output/entry.txt (${JOKE.length} chars, ${countWords(JOKE)} words)`,
);
