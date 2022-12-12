import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[zeroFiller]])('%o', (run) => {
  it('should not change anything if the matrix does not contain any zero', () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.nat({ max: 100 }), fc.nat({ max: 100 })).chain(([N, M]) =>
          fc.array(
            fc.array(
              fc.integer().filter((v) => v !== 0),
              { minLength: M, maxLength: M }
            ),
            { minLength: N, maxLength: N }
          )
        ),
        (matrix) => {
          const clonedMatrix = matrix.map((line) => [...line]);
          run(clonedMatrix);
          expect(clonedMatrix).toEqual(matrix);
        }
      )
    );
  });

  it('should fill lines and columns for zeros', () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.integer({ min: 1, max: 100 }), fc.integer({ min: 1, max: 100 })).chain(([N, M]) =>
          fc.tuple(
            fc.array(
              fc.array(
                fc.integer().filter((v) => v !== 0),
                { minLength: M, maxLength: M }
              ),
              { minLength: N, maxLength: N }
            ),
            fc.array(fc.tuple(fc.integer({ min: 0, max: N - 1 }), fc.integer({ min: 0, max: M - 1 })))
          )
        ),
        ([matrix, zeros]) => {
          const matrixWithAddedZeros = matrix.map((line) => [...line]);
          const matrixWithAllAddedZeros = matrix.map((line) => [...line]);
          for (const [y, x] of zeros) {
            matrixWithAddedZeros[y][x] = 0;
            for (let i = 0; i !== matrixWithAllAddedZeros.length; ++i) {
              matrixWithAllAddedZeros[i][x] = 0;
            }
            for (let j = 0; j !== matrixWithAllAddedZeros[0].length; ++j) {
              matrixWithAllAddedZeros[y][j] = 0;
            }
          }
          run(matrixWithAddedZeros);
          expect(matrixWithAddedZeros).toEqual(matrixWithAllAddedZeros);
        }
      )
    );
  });
});

// Implementations

function zeroFiller(matrix) {
  // n is matrix.length
  // m is matrix[0].length
  // Average Time Complexity: O(n*m)
  // Average Space Complexity: O(max(n,m))
  const zeroInColumn = new Set();
  const zeroInRow = new Set();
  for (let i = 0; i !== matrix.length; ++i) {
    for (let j = 0; j !== matrix[0].length; ++j) {
      const cell = matrix[i][j];
      if (cell === 0) {
        zeroInColumn.add(j);
        zeroInRow.add(i);
      }
    }
  }
  for (const col of zeroInColumn) {
    for (let i = 0; i !== matrix.length; ++i) {
      matrix[i][col] = 0;
    }
  }
  for (const row of zeroInRow) {
    for (let i = 0; i !== matrix[0].length; ++i) {
      matrix[row][i] = 0;
    }
  }
}
