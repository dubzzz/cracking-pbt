import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[countStepsJumper], [countStepsJumperIterative]])('%o', (run) => {
  it('should compute a count aligned with count on directly available positions', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1_000 }), (n) => {
        expect(run(n)).toBe(run(n - 1) + run(n - 2) + run(n - 3));
      })
    );
  });

  it.each`
    n    | expected
    ${1} | ${1n /* 1 */}
    ${2} | ${2n /* 1,1 or 2 */}
    ${3} | ${4n /* 1,1,1 or 1,2 or 2,1 or 3 */}
  `('should find $expected for $n', ({ n, expected }) => {
    expect(run(n)).toBe(expected);
  });
});

// Implementations

function countStepsJumper(n) {
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)

  const combinations = [1n];
  function compute(n) {
    if (n in combinations) {
      return combinations[n];
    }
    if (n < 0) {
      return 0n;
    }
    const calc = compute(n - 1) + compute(n - 2) + compute(n - 3);
    combinations[n] = calc;
    return calc;
  }
  return compute(n);
}

function countStepsJumperIterative(n) {
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)
  if (n < 0) {
    return 0n;
  }
  const combinations = [1n];
  for (let i = 1; i <= n; ++i) {
    combinations.push(combinations[i - 1] + (combinations[i - 2] || 0n) + (combinations[i - 3] || 0n));
  }
  return combinations[n];
}
