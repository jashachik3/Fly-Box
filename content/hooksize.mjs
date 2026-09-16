// Fly Box — hook sizes on one monotonic scale
// ---------------------------------------------------------------------------
// Hook sizes do not run in one direction. They count DOWN as they get bigger —
// 22, 18, 12, 8, 4, 2, 1 — and then flip into "aught" sizes that count UP:
// 1/0, 2/0, 3/0, 4/0, each bigger than the last and all bigger than a 1.
//
// Store that as a plain [min, max] of the printed number and a 1/0 sorts as
// smaller than a 22. So sizes are held internally on a single signed scale
// where SMALLER MEANS BIGGER HOOK, and printed back through format().
//
//   4/0 -> -3      2 -> 2
//   3/0 -> -2      8 -> 8
//   2/0 -> -1     22 -> 22
//   1/0 ->  0
//
// Zero dependencies; used by the importer, the validator and the app.

/** "2/0" -> -1, "8" -> 8. Returns null on anything unparseable. */
export function parseHookSize(token) {
  const t = String(token ?? '').trim();
  const aught = t.match(/^(\d+)\s*\/\s*0$/);
  if (aught) return 1 - Number(aught[1]);
  const plain = t.match(/^(\d+)$/);
  return plain ? Number(plain[1]) : null;
}

/** -1 -> "2/0", 8 -> "8". */
export function formatHookSize(n) {
  if (n == null) return '';
  return n <= 0 ? `${1 - n}/0` : String(n);
}

/** "8-2/0" -> [-1, 8], ascending, so the range is always well-formed. */
export function parseHookRange(s) {
  const parts = String(s ?? '').split(/[-–]/).map((x) => x.trim()).filter(Boolean);
  // "1/0-3/0" splits on the hyphen into "1/0" and "3/0" — but "8-2/0" splits
  // into "8", "2/0" too, so a plain split is right as long as the slash stays
  // attached, which it does.
  const nums = parts.map(parseHookSize).filter((n) => n != null);
  if (nums.length < 2) return nums.length === 1 ? [nums[0], nums[0]] : null;
  return [Math.min(...nums), Math.max(...nums)];
}

/** [-1, 8] -> "2/0–8": biggest HOOK first, the way a shop writes a range. */
export const formatHookRange = (r) =>
  (!r ? '' : r[0] === r[1] ? formatHookSize(r[0]) : `${formatHookSize(r[0])}–${formatHookSize(r[1])}`);
