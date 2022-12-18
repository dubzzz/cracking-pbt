import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[countToFlip]])('%o', (run) => {
  it('should have nothing to flip to go to self', () => {
    fc.assert(
      fc.property(fc.nat(), (n) => {
        const num = run(n, n);
        expect(num).toBe(0);
      })
    );
  });
  it('should return the right flip count', () => {
    fc.assert(
      fc.property(fc.nat(), fc.nat(), (n1, n2) => {
        const num = run(n1, n2);
        const rawN1String = n1.toString(2);
        const rawN2String = n2.toString(2);
        const longest = Math.max(rawN1String.length, rawN2String.length);
        const n1String = rawN1String.padStart(longest, '0');
        const n2String = rawN2String.padStart(longest, '0');
        const expectedFlipCount = n1String
          .split('')
          .reduce((acc, _, index) => (n1String[index] !== n2String[index] ? acc + 1 : acc), 0);
        expect(num).toBe(expectedFlipCount);
      })
    );
  });
});

// Implementations

function countToFlip(v1, v2) {
  let numFlips = 0;
  const end = Math.max(v1, v2);
  for (let it = 1; it <= end; it *= 2) {
    if ((v1 & it) !== (v2 & it)) {
      numFlips += 1;
    }
  }
  return numFlips;
}
