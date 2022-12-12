import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[compress]])('%o', (run) => {
  it('should put a 1 after each character if the string is made of chars being alone', () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(fc.char()).map((a) => a.join('')),
        (s) => {
          const expectedCompressed = s
            .split('')
            .flatMap((c) => [c, '1'])
            .join('');
          expect(run(s)).toBe(expectedCompressed);
        }
      )
    );
  });

  it('should recompute the same compressed version (not twice the same character)', () => {
    fc.assert(
      fc.property(
        // char only produces entries made of code-points with .length === 1
        fc.array(fc.tuple(fc.char(), fc.integer({ min: 1, max: 9 }))),
        (compressed) => {
          let previousC = '';
          let s = '';
          let compressedString = '';
          for (const [c, count] of compressed) {
            fc.pre(previousC !== c); // [['c', 1], ['c', 1]] would be compressed into 'c2' not 'c1c1', so we discard these entries
            previousC = c;
            compressedString += c + String(count);
            for (let index = 0; index !== count; ++index) {
              s += c;
            }
          }
          expect(run(s)).toBe(compressedString);
        }
      )
    );
  });
});

// Implementations

function compress(input) {
  // n is input.length
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)

  if (input.length === 0) {
    return input;
  }

  // Depending how well our JS runtime handles += on strings, we can move to an array + push (amortized complexity) followed by join to build the final string.
  let newString = input[0];
  let lastCount = 1;
  for (let index = 1; index !== input.length; ++index) {
    // newString[newString.length -1] does not properly handles code-points, thus we opt-ed for a for-let instead of for-of
    // to have a consistent interation logic
    const c = input[index];
    if (lastCount < 9 && c === newString[newString.length - 1]) {
      ++lastCount;
    } else {
      newString += String(lastCount) + c;
      lastCount = 1;
    }
  }
  return newString + String(lastCount);
}
