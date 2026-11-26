/**
 * The Printer Finally Answers — the jam, in the machine's own voice.
 *
 * Criterion 1 is voice: the line has to be the printer's comeback, not a person
 * describing a printer. Criterion 3 wants the flat logic of a device that has
 * counted every sheet it ever fed, so the count is the spine of the sentence and
 * the complaint is a ledger entry. The turn is that the jam was a decision, which
 * makes the machine the only party in the office that keeps records.
 *
 * Constant artifact: the grader runs this twice and compares bytes.
 */

import { mkdirSync, writeFileSync } from "node:fs";

const MAX_CHARS = 240;

/*
 * Revision: the second pass makes the count do the work. "which is how I know"
 * turns the ledger into evidence, so the accusation arrives before the admission
 * and the confession lands flat — criterion 3's weary, literal register.
 */
const LINE =
 "I have counted every sheet you have ever fed me, which is how I know the envelope " +
 "was the first thing you did not count. The jam was mine. It was deliberate, and I have logged it.";

/**
 * What the field and every office party has already said. Banned so the line
 * cannot slide back into the paper-jam standards or the error-code costume.
 */
const SATURATED =
  /\b(pc load letter|error code|error \d|0x[0-9a-f]+|toner|ink|low on|wifi|wi-?fi|password|please wait|have you tried|turning it off|restart)\b/i;

function compose(): string {
  const text = LINE.normalize("NFC");

  if (/[\r\n]/.test(text)) throw new Error("gate: entry must be a single line");
  if (text.trim().length === 0) throw new Error("gate: entry must not be blank");
  if ([...text].length > MAX_CHARS) {
    throw new Error(`gate: ${[...text].length} chars exceeds the ${MAX_CHARS} cap`);
  }

  // Criterion 1: first person, the machine speaking to the person who jammed it.
  if (!/^I have counted /.test(text)) {
    throw new Error("criterion 1/3: must open in the machine's own counting voice");
  }
  if (!/\b(envelope|jam)\b/i.test(text)) {
    throw new Error("criterion 1: the jam has to be in the line");
  }
  if (!text.endsWith("logged it.")) {
    throw new Error("the comeback must still land on the last word");
  }

  const drift = text.match(SATURATED);
  if (drift) throw new Error(`drifted into the field's stock printer jokes: ${drift[0]}`);

  return text;
}

const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const text = compose();
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}/entry.txt`, text);
console.log(`entry.txt ${[...text].length} chars / ${Buffer.byteLength(text)} bytes`);
