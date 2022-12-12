import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { toLinkedList } from './helpers';

// Tests

describe.each([[kthLast]])('%o', (run) => {
  it('should retrieve the kth last element', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), fc.nat(), (data, k) => {
        const expectedElement = data[data.length - 1 - k];
        expect(run(toLinkedList(data), k)).toBe(expectedElement);
      })
    );
  });
});

// Implementations

function kthLast(linkedList, k) {
  // n is number of items in linkedList
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(1)
  let length = 0;
  for (let cursor = linkedList; cursor !== undefined; cursor = cursor.next) {
    ++length;
  }
  for (let cursor = linkedList, i = 0; cursor !== undefined; cursor = cursor.next, ++i) {
    if (i === length - k - 1) {
      return cursor.value;
    }
  }
  return undefined;
}
