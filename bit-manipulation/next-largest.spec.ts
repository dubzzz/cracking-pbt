import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[nextLargest]])('%o', (run) => {
  it('should produce an integer value with the same number of 1 bits', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1 }), (n) => {
        const next = run(n);
        expect(Number.isInteger(next)).toBe(true);
        expect(count1s(next)).toBe(count1s(n));
      })
    );
  });

  it('should produce the closest integer value with the same number of 1 bits', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }), // we capped the max to avoid running into too long computation for the expectedNext
        (n) => {
          const next = run(n);
          let expectedNext;
          for (expectedNext = n + 1; count1s(expectedNext) !== count1s(n); ++expectedNext) {}
          expect(next).toBe(expectedNext);
        }
      )
    );
  });
});

// Helpers

function count1s(n) {
  return n
    .toString(2)
    .split('')
    .filter((c) => c === '1').length;
}

// Implementations

function nextLargest(value) {
  // Find the smallest '1' in value
  let smallest1Index;
  let powSmallest1;
  for (smallest1Index = 0, powSmallest1 = 1; (value & powSmallest1) === 0; ++smallest1Index, powSmallest1 *= 2) {}

  // Find the smallest '0' after the smallest '1' in value
  let smallest0After1Index;
  let powSmallest0After1;
  for (
    smallest0After1Index = smallest1Index, powSmallest0After1 = powSmallest1;
    (value & powSmallest0After1) !== 0;
    ++smallest0After1Index, powSmallest0After1 *= 2
  ) {}

  // Compute the final number
  // 1000-1110 -> 0001-0000
  //              =powSmallest0After1
  //           -> 0001-0011
  //              + (powSmallest0After1 / (2*powSmallest1)) -1
  //           -> 1001-0011
  //              + value - (powSmallest0After1 -1) + (powSmallest1 -1)
  // = powSmallest0After1 + (powSmallest0After1 / (2*powSmallest1)) -1 + value - powSmallest0After1 +1 + powSmallest1 -1
  // = (powSmallest0After1 / (2*powSmallest1)) + value + powSmallest1 -1
  return powSmallest0After1 / (2 * powSmallest1) + value + powSmallest1 - 1;
}
