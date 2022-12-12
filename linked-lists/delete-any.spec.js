import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { toLinkedList } from './helpers';

// Tests

describe.each([[deleteAny]])('%o', (run) => {
  it('should be able to drop a node at the middle of a linked list with only access to it', () => {
    fc.assert(
      fc.property(fc.array(fc.nat(), { minLength: 2 }), fc.nat(), (data, k) => {
        const linkedList = toLinkedList(data);
        const pos = k % (data.length - 1); // not applicable on the last element
        const nodeToDrop = extractKth(linkedList, pos);
        run(nodeToDrop);
        expect(linkedList).toEqual(toLinkedList([...data.slice(0, pos), ...data.slice(pos + 1)]));
      })
    );
  });
});

// Helpers

function extractKth(linkedList, k) {
  for (let cursor = linkedList, i = 0; cursor !== undefined; cursor = cursor.next, ++i) {
    if (i === k) {
      return cursor;
    }
  }
  return undefined;
}

// Implementations

function deleteAny(node) {
  // -
  // Average Time Complexity: O(1)
  // Average Space Complexity: O(1)
  node.value = node.next?.value;
  node.next = node.next?.next;
}
