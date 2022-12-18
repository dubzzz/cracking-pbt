import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[findMagicIndex]])('%o', (run) => {
  it('should only return something magic to a magic index', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer()), (data) => {
        const sortedData = [...data].sort((a, b) => a - b);
        const out = run(sortedData);
        if (out !== undefined) {
          expect(sortedData[out]).toBe(out);
        }
      })
    );
  });

  it('should only return a magic index if there is one', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer()), (data) => {
        const sortedData = [...data].sort((a, b) => a - b);
        const hasMagicIndex = sortedData.some((item, index) => item === index);
        const out = run(sortedData);
        if (hasMagicIndex) {
          expect(out).toBeDefined();
        } else {
          expect(out).not.toBeDefined();
        }
      })
    );
  });
});

// Implementations

function findMagicIndex(data) {
  // n is the length of data
  // Average Time Complexity: O(log n)
  // Average Space Complexity: O(1)

  let min = 0;
  let max = data.length;
  while (min < max) {
    const mid = Math.floor((min + max) / 2);
    if (data[mid] === mid) {
      return mid;
    } else if (data[mid] < mid) {
      if (min === mid) {
        return undefined;
      }
      min = mid;
    } else {
      max = mid;
    }
  }
  return undefined;
}
