import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[replaceAllSpaces]])('%o', (run) => {
  it('should replace spaces by %20', () => {
    fc.assert(
      fc.property(fc.array(fc.char()), (charArray) => {
        const copiedCharArray = [...charArray];
        const expectedCharArray = [...charArray.join('').replace(/ /g, '%20')];
        run(copiedCharArray);
        expect(copiedCharArray).toEqual(expectedCharArray);
      })
    );
  });
});

// Implementations

function replaceAllSpaces(input) {
  // n is input.length
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(1)

  // We consider input as an array of characters, so that we can perform side-effects directly on it.
  let numSpaces = 0;
  for (const c of input) {
    if (c === ' ') {
      ++numSpaces;
    }
  }
  if (numSpaces === 0) {
    return input;
  }

  // We increase the length of input to reach the target size
  const initialLength = input.length;
  const finalLength = input.length + 2 * numSpaces;
  input.length = finalLength;

  // We alter input in-place
  for (let i = initialLength - 1, cursor = finalLength - 1; i >= 0; --i, --cursor) {
    if (input[i] !== ' ') {
      input[cursor] = input[i];
    } else {
      input[cursor] = '0';
      input[--cursor] = '2';
      input[--cursor] = '%';
    }
  }
}
