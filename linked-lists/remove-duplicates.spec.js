import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[removeDuplicates, removeDuplicatesNoBuffer]])('%o', (run) => {
  it('should remove all duplicates from the linked list', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), (data) => {
        const originalLinkedList = toLinkedList(data);
        const duplicateLessLinkedList = toLinkedList([...new Set(data)]);
        run(originalLinkedList);
        expect(originalLinkedList).toEqual(duplicateLessLinkedList);
      })
    );
  });
});

// Helpers

function toLinkedList(data) {
  if (data.length === 0) return undefined;
  const rootNode = { value: data[0], next: undefined };
  let previousNode = rootNode;
  for (let index = 1; index !== data.length; ++index) {
    const currentNode = { value: data[index], next: undefined };
    previousNode.next = currentNode;
    previousNode = currentNode;
  }
  return rootNode;
}

// Implementations

function removeDuplicates(linkedList) {
  // n is number of items in linkedList
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)
  const alreadySeen = new Set();
  for (
    let cursor = linkedList, previousCursor = undefined;
    cursor !== undefined;
    previousCursor = cursor, cursor = cursor.next
  ) {
    if (alreadySeen.has(cursor.value)) {
      previousCursor.next = cursor.next;
      cursor = previousCursor;
    } else {
      alreadySeen.add(cursor.value);
    }
  }
}

function removeDuplicatesNoBuffer(linkedList) {
  // n is number of items in linkedList
  // Average Time Complexity: O(n**2)
  // Average Space Complexity: O(1)
  for (let rootCursor = linkedList; rootCursor !== undefined; rootCursor = rootCursor.next) {
    const forbiddenValue = rootCursor.value;
    for (
      let cursor = rootCursor.next, previousCursor = rootCursor;
      cursor !== undefined;
      previousCursor = cursor, cursor = cursor.next
    ) {
      if (cursor.value === forbiddenValue) {
        previousCursor.next = cursor.next;
        cursor = previousCursor;
      }
    }
  }
}
