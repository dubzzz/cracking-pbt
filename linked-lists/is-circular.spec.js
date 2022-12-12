import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { toLinkedList } from './helpers';

// Tests

describe.each([[isCircular, isCircularRefBased]])('%o', (run) => {
  it('should not detect cycle in lists not having any', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), (data) => {
        expect(run(toLinkedList(data))).toBe(undefined);
      })
    );
  });

  it('should detect starting point of cycle in lists if there is one', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), fc.array(fc.nat(), { minLength: 1 }), (data1, data2) => {
        const data1List = toLinkedList(data1);
        const data2List = toLinkedList(data2);
        lastNode(data2List).next = data2List;
        if (data1List !== undefined) {
          lastNode(data1List).next = data2List;
        }
        const list = data1List ?? data2List;
        expect(run(list).value).toBe(data2[0]);
      })
    );
  });
});

// Helpers

function lastNode(linkedList) {
  for (let cursor = linkedList; cursor !== undefined; cursor = cursor.next) {
    if (cursor.next === undefined) {
      return cursor;
    }
  }
  return undefined;
}

// Implementations

function isCircular(linkedList) {
  // n is number of items in linkedList
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(1)
  function detectSlowFastCollision() {
    let ignore = true;
    for (
      let slowCursor = linkedList?.next, fastCursor = linkedList?.next?.next;
      slowCursor !== undefined && fastCursor !== undefined;
      slowCursor = slowCursor.next, fastCursor = fastCursor.next?.next
    ) {
      if (!ignore && slowCursor === fastCursor) {
        return slowCursor;
      }
      ignore = false;
    }
    return undefined;
  }
  let slowFastCursor = detectSlowFastCollision();
  if (slowFastCursor === undefined) {
    return undefined;
  }
  // If we call i the number of iteration before reaching the collision between fast and slow runners,
  // b the offset before the loop and c the length of the cycle we get:
  // - At collision:
  //   slow moved by: "i - b" iterations in the cycle
  //   fast moved by: "2 i - b" iterations in the cycle
  //   i-b mod c = 2i-b mod c, so i mod c = 2i mod c or more precisely i is a multiple of c
  //   it means we have b missing steps to go back to the start of the cycle
  for (let startCursor = linkedList; ; startCursor = startCursor.next, slowFastCursor = slowFastCursor.next) {
    if (startCursor === slowFastCursor) {
      return startCursor;
    }
  }
}

function isCircularRefBased(linkedList) {
  // n is number of items in linkedList
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)
  const alreadySeen = new Set();
  for (let cursor = linkedList; cursor !== undefined; cursor = cursor.next) {
    if (alreadySeen.has(alreadySeen)) {
      return cursor;
    }
    alreadySeen.add(cursor);
  }
  return undefined;
}
