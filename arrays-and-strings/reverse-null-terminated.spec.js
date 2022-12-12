import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[reverseNullTerminated]])('%o', (run) => {
  it('should reverse null terminated in-place', () => {
    fc.assert(
      fc.property(fc.array(fc.integer().filter((n) => n !== 0)), (nonNullTerminated) => {
        const nullTerminated = [...nonNullTerminated, 0];
        // Remark: calling .reverse() when testing .reverse() is not recommended except if the core of the function will definitely never ever rely on .reverse()
        // in such case the property is confirming that two pieces of code are behaving the same way.
        const expectedReverseNullTerminated = [...[...nonNullTerminated].reverse(), 0];
        run(nullTerminated);
        expect(nullTerminated).toEqual(expectedReverseNullTerminated);
      })
    );
  });
  it('should reverse null terminated in-place and be able to reverse it back', () => {
    fc.assert(
      fc.property(fc.array(fc.integer().filter((n) => n !== 0)), (nonNullTerminated) => {
        const nullTerminated = [...nonNullTerminated, 0];
        const expectedReverseReverseNullTerminated = [...nonNullTerminated, 0];
        run(nullTerminated);
        run(nullTerminated);
        expect(nullTerminated).toEqual(expectedReverseReverseNullTerminated);
      })
    );
  });
});

// Implementations

function reverseNullTerminated(input) {
  // input = n
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(1)

  // Side-notes:
  // - We make the hypothesis that we do not have access to the length of the input to mimic C behaviour.
  //  The only way to get it would be to iterate over all its characters until \0.
  // - We also do the reverse in-place.

  let length = 0;
  while (input[length]) {
    // Loop continuing until we find 0 or undefined (undefined being a buggy entry)
    ++length;
  }

  for (let i = 0; i !== Math.ceil(length / 2); ++i) {
    const other = input[i];
    input[i] = input[length - i - 1];
    input[length - i - 1] = other;
  }
}
