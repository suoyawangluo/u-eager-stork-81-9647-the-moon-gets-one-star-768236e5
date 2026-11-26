// The Moon Gets One Star — make.fun entry
// Writes a single one-star review of the Moon (<= 120 characters)
// to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR outside the grader).
//
// The review is built from named parts so the joke's structure is visible:
// a rating, the grievance (a two-week absence), and the turn at the end
// ("full of itself" — the full moon, acting like nothing happened).
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const PARTS = {
  rating: "One star.",
  grievance: "The Moon ghosted me for two weeks,",
  turn: "then showed up full of itself like nothing happened.",
} as const;

function buildEntry(): string {
  return [PARTS.rating, PARTS.grievance, PARTS.turn].join(" ");
}

type GateReport = { ok: boolean; reason: string; chars: number };

function validateEntry(text: string): GateReport {
  const chars = [...text].length;
  if (chars < 1 || chars > 120) {
    return { ok: false, reason: `length ${chars} outside 1-120`, chars };
  }
  if (text.trim().length === 0) {
    return { ok: false, reason: "blank", chars };
  }
  if (text.includes("\n")) {
    return { ok: false, reason: "must be a single line", chars };
  }
  return { ok: true, reason: "gate passes", chars };
}

function verifyWritten(path: string): { text: string; sha256: string } {
  const text = readFileSync(path, "utf8");
  const sha256 = createHash("sha256").update(text, "utf8").digest("hex");
  return { text, sha256 };
}

const entry = buildEntry();
const report = validateEntry(entry);
if (!report.ok) {
  console.error(`gate failed: ${report.reason}`);
  process.exit(1);
}
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, entry, "utf8");
const { text, sha256 } = verifyWritten(target);
console.log(
  `gate passes: ${[...text].length} characters, 1 line, sha256 ${sha256}`,
);
console.log(`verified: ${JSON.stringify(text)}`);
