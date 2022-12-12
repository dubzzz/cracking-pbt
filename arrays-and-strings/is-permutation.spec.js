import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[isPermutation]])('%o', (run) => {
  it('should detect permutations', () => {
    fc.assert(
      fc.property(
        fc.string().chain((s) =>
          fc.tuple(
            fc.constant(s),
            fc.shuffledSubarray([...s], { minLength: s.length }).map((cs) => cs.join(''))
          )
        ),
        ([s1, s2]) => {
          expect(run(s1, s2)).toBe(true);
        }
      )
    );
  });

  it('should detect non-permutations diverging on one entry', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).chain((s) =>
          fc.tuple(
            fc.constant(s),
            fc.shuffledSubarray([...s], { minLength: s.length }).map((cs) => cs.join(''))
          )
        ),
        fc.char(),
        fc.nat(),
        ([s1, s2], c, index) => {
          const splitS2 = [...s2];
          fc.pre(splitS2[index % splitS2.length] !== c);
          splitS2[index % splitS2.length] = c;
          expect(run(s1, splitS2.join(''))).toBe(false);
        }
      )
    );
  });
});

// Implementations

function isPermutation(s1, s2) {
  // n is s1.length
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)
  if (s1.length !== s2.length) {
    return false;
  }
  const seenKeys = new Map();
  for (const c of s1) {
    // Iterating over code-points
    seenKeys.set(c, (seenKeys.get(c) || 0) + 1);
  }
  for (const c of s2) {
    // Iterating over code-points
    const num = seenKeys.get(c); // getting undefined in case c does not exist
    if (num === undefined) {
      return false;
    }
    if (num === 1) {
      seenKeys.delete(c);
    } else seenKeys.set(c, num - 1);
  }
  return seenKeys.size === 0;
}
