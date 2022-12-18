import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[countRobotPaths], [countRobotPathsIterative]])('%o', (run) => {
  it('should compute a count aligned with count on directly available positions', () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.integer({ min: 2, max: 100 }), fc.integer({ min: 2, max: 100 })).chain(([n, m]) => {
          // true means authorized
          return fc.array(
            fc.array(
              fc.option(fc.constant(true), { nil: false }), // using option instead of boolean to increase the chance of true
              { minLength: n, maxLength: n }
            ),
            { minLength: m, maxLength: m }
          );
        }),
        (map) => {
          fc.pre(map[0][0]); // following assertion is only true if the starting point is not a forbidden one
          const mapLeft = map.map((line) => line.slice(1));
          const mapBottom = map.slice(1);
          expect(run(map)).toBe(run(mapLeft) + run(mapBottom));
        }
      )
    );
  });
});

// Implementations

function countRobotPaths(map) {
  // n,m such as map is n per m
  // Average Time Complexity: O(n x m)
  // Average Space Complexity: O(n x m)

  if (map.length === 0 || map[0].length === 0) {
    return 0n;
  }
  if (!map[0][0] || !map[map.length - 1][map[0].length - 1]) {
    return 0n;
  }

  const combinations = [...Array(map.length)].map(() => [...Array(map[0].length)]);
  combinations[map.length - 1][map[0].length - 1] = 1n;
  function compute(x, y) {
    if (x >= map.length || y >= map[0].length) {
      return 0n;
    }
    if (combinations[x][y] !== undefined) {
      return combinations[x][y];
    }
    if (!map[x][y]) {
      return 0n; // forbidden cell, no path from there
    }
    const calc = compute(x + 1, y) + compute(x, y + 1);
    combinations[x][y] = calc;
    return calc;
  }
  return compute(0, 0);
}

function countRobotPathsIterative(map) {
  // n,m such as map is n per m
  // Average Time Complexity: O(n x m)
  // Average Space Complexity: O(n x m)

  if (map.length === 0 || map[0].length === 0) {
    return 0n;
  }
  const maxX = map.length - 1;
  const maxY = map[0].length - 1;
  if (!map[0][0] || !map[maxX][maxY]) {
    return 0n;
  }

  const combinations = [...Array(map.length)].map(() => [...Array(map[0].length)]);
  combinations[maxX][maxY] = 1n;

  for (let y = maxY; y >= 0; --y) {
    if (y === maxY) {
      for (let x = maxX - 1; x >= 0; --x) {
        if (map[x][y]) {
          combinations[x][y] = combinations[x + 1][y];
        } else {
          combinations[x][y] = 0n;
        }
      }
    } else {
      if (map[maxX][y]) {
        combinations[maxX][y] = combinations[maxX][y + 1];
      } else {
        combinations[maxX][y] = 0n;
      }
      for (let x = maxX - 1; x >= 0; --x) {
        if (map[x][y]) {
          combinations[x][y] = combinations[x + 1][y] + combinations[x][y + 1];
        } else {
          combinations[x][y] = 0n;
        }
      }
    }
  }
  return combinations[0][0];
}
