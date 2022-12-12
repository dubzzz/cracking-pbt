import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { toLinkedList, fromLinkedList } from './helpers';

// Tests

describe.each([[partition]])('%o', (run) => {
  it('should preserve the length', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), fc.nat(), (data, value) => {
        const partitioned = run(toLinkedList(data), value);
        expect(fromLinkedList(partitioned)).toHaveLength(data.length);
      })
    );
  });

  it('should preserve the items', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), fc.nat(), (data, value) => {
        const partitioned = run(toLinkedList(data), value);
        const orderedItemsPartition = fromLinkedList(partitioned).sort().join(',');
        const orderedItems = [...data].sort().join(',');
        expect(orderedItemsPartition).toEqual(orderedItems);
      })
    );
  });

  it('should have < first, then =, then >', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), fc.nat(), (data, value) => {
        const partitioned = run(toLinkedList(data), value);
        const partitionedData = fromLinkedList(partitioned);
        let state = -1;
        for (const item of partitionedData) {
          const newState = item < value ? -1 : item === value ? 0 : 1;
          expect(newState).toBeGreaterThanOrEqual(state);
          state = newState;
        }
      })
    );
  });
});

// Implementations

function partition(linkedList, value) {
  // n is number of items in linkedList
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(1)
  let smallerStart = undefined;
  let equalStart = undefined;
  let largerStart = undefined;
  let smaller = undefined;
  let equal = undefined;
  let larger = undefined;

  // Partition the data
  let cursor = linkedList;
  while (cursor !== undefined) {
    const nextCursor = cursor.next;
    cursor.next = undefined;
    if (cursor.value < value) {
      // This pattern is copied 3 times: one for <, one for =, one for >
      // but it could probably be factorized
      if (smaller !== undefined) {
        smaller.next = cursor;
        smaller = cursor;
      } else {
        smallerStart = cursor;
        smaller = cursor;
      }
    } else if (cursor.value === value) {
      if (equal !== undefined) {
        equal.next = cursor;
        equal = cursor;
      } else {
        equalStart = cursor;
        equal = cursor;
      }
    } else {
      if (larger !== undefined) {
        larger.next = cursor;
        larger = cursor;
      } else {
        largerStart = cursor;
        larger = cursor;
      }
    }
    cursor = nextCursor;
  }

  // Merge partitions together
  if (larger !== undefined) {
    if (equal !== undefined) {
      equal.next = largerStart;
    } else {
      equal = larger;
      equalStart = largerStart;
    }
  }
  if (equal !== undefined) {
    if (smaller !== undefined) {
      smaller.next = equalStart;
    } else {
      smaller = equal;
      smallerStart = equalStart;
    }
  }
  return smallerStart;
}
