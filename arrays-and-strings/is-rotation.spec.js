import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[isRotation]])('%o', (run) => {
  it('should detect rotation', () => {
    fc.assert(
      fc.property(fc.string(), fc.nat(), (s, rot) => {
        const pos = rot % s.length;
        const other = s.substring(pos) + s.substring(0, pos);
        expect(run(s, other)).toBe(true);
      })
    );
  });
});

// Implementations

function isRotation(s1, s2) {
  // n is s1.length
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)
  if (s1.length !== s2.length) {
    return false;
  }
  return (s1 + s1).includes(s2);
}
