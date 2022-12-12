import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[rotate90]])('%o', (run) => {
  it('should fallback to the original matrix after 4 ticks', () => {
    fc.assert(
      fc.property(
        fc
          .nat({ max: 100 })
          .chain((N) => fc.array(fc.array(fc.nat(), { minLength: N, maxLength: N }), { minLength: N, maxLength: N })),
        (matrix) => {
          const clonedMatrix = matrix.map((line) => [...line]);
          run(clonedMatrix);
          run(clonedMatrix);
          run(clonedMatrix);
          run(clonedMatrix);
          expect(clonedMatrix).toEqual(matrix);
        }
      )
    );
  });

  it('should turn first column as first line reversed', () => {
    fc.assert(
      fc.property(
        fc
          .integer({ min: 1, max: 100 })
          .chain((N) => fc.array(fc.array(fc.nat(), { minLength: N, maxLength: N }), { minLength: N, maxLength: N })),
        (matrix) => {
          const clonedMatrix = matrix.map((line) => [...line]);
          run(clonedMatrix);
          const firstLineAltered = clonedMatrix[0];
          const firstColumnSourceReversed = matrix.map((line) => line[0]).reverse();
          expect(firstLineAltered).toEqual(firstColumnSourceReversed);
        }
      )
    );
  });
});

// Implementations

function rotate90(matrix) {
  // n is matrix.length
  // Average Time Complexity: O(n**2)
  // Average Space Complexity: O(1)
  const N = matrix.length;
  for (let i = 0; i !== Math.floor(N / 2); ++i) {
    for (let j = 0; j !== Math.ceil(N / 2); ++j) {
      const topLeft = matrix[j][i];
      matrix[j][i] = matrix[N - i - 1][j];
      matrix[N - i - 1][j] = matrix[N - j - 1][N - i - 1];
      matrix[N - j - 1][N - i - 1] = matrix[i][N - j - 1];
      matrix[i][N - j - 1] = topLeft;
    }
  }
}
