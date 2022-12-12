import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[hasAllUnique], [hasAllUniqueShortest], [hasAllUniqueWithoutExtraStorage]])('%o', (run) => {
  it('should detect strings with at least on duplicated character', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), fc.char(), (start, mid, end, dup) => {
        const stringWithDuplicate = `${start}${dup}${mid}${dup}${end}`;
        expect(run(stringWithDuplicate)).toBe(false);
      })
    );
  });
  it('should not detect strings made of only unique characters', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.char()), (uniqueCharacters) => {
        const stringWithoutDuplicate = uniqueCharacters.join('');
        expect(run(stringWithoutDuplicate)).toBe(true);
      })
    );
  });
});

// Implementations

function hasAllUnique(input) {
  // input = n
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)
  const alreadySeenCharacters = new Set();
  for (const c of input) {
    // We iterate over code-points, we could go further and iterate over graphemes
    // but we would probably need to leverage much more complex algorithms
    if (alreadySeenCharacters.has(c)) {
      return false;
    }
    alreadySeenCharacters.add(c);
  }
  return true;
}

function hasAllUniqueShortest(input) {
  // input = n
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)
  const splitInCodePoints = [...input];
  return new Set(splitInCodePoints).size === splitInCodePoints.length;
}

function hasAllUniqueWithoutExtraStorage(input) {
  // input = n
  // Average Time Complexity: O(n**2)
  // Average Space Complexity: O(1)
  function lengthAt(s, index) {
    return String.fromCodePoint(s.codePointAt(index)).length;
  }
  for (let i = 0; i < input.length; i += lengthAt(input, i)) {
    for (let j = i + lengthAt(input, i); j < input.length; j += lengthAt(input, j)) {
      if (input.codePointAt(i) === input.codePointAt(j)) {
        return false;
      }
    }
  }
  return true;
}
