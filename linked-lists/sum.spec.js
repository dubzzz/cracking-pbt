import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { toLinkedList } from './helpers';

// Tests

describe.each([[sum]])('%o', (run) => {
  it('should properly compute the sum of two linked lists', () => {
    fc.assert(
      fc.property(fc.bigUint(), fc.bigUint(), (n1, n2) => {
        const n1List = toLinkedList(
          String(n1)
            .split('')
            .map((v) => +v)
            .reverse()
        );
        const n2List = toLinkedList(
          String(n2)
            .split('')
            .map((v) => +v)
            .reverse()
        );
        const sumList = toLinkedList(
          String(n1 + n2)
            .split('')
            .map((v) => +v)
            .reverse()
        );
        expect(run(n1List, n2List)).toEqual(sumList);
      })
    );
  });
});

describe.each([[sumReversed]])('%o', (run) => {
  it('should properly compute the reversed sum of two linked lists', () => {
    fc.assert(
      fc.property(fc.bigUint(), fc.bigUint(), (n1, n2) => {
        const n1List = toLinkedList(
          String(n1)
            .split('')
            .map((v) => +v)
        );
        const n2List = toLinkedList(
          String(n2)
            .split('')
            .map((v) => +v)
        );
        const sumList = toLinkedList(
          String(n1 + n2)
            .split('')
            .map((v) => +v)
        );
        expect(run(n1List, n2List)).toEqual(sumList);
      })
    );
  });
});

// Implementations

function sum(n1, n2) {
  // n1 is number of items in n1
  // n2 is number of items in n2
  // Average Time Complexity: O(max(n1,n2))
  // Average Space Complexity: O(max(n1,n2))
  let missing = 0;
  const sumStart = { value: -1, next: undefined }; // magic value to handle start, could be done differently
  let sum = sumStart;
  for (let c1 = n1, c2 = n2; !(c1 === undefined && c2 === undefined && missing === 0); c1 = c1?.next, c2 = c2?.next) {
    const v1 = c1?.value ?? 0;
    const v2 = c2?.value ?? 0;
    const fullValue = v1 + v2 + missing;
    missing = Math.floor(fullValue / 10);
    sum.next = { value: fullValue % 10, next: undefined };
    sum = sum.next;
  }
  return sumStart.next;
}

function sumReversed(n1, n2) {
  // n1 is number of items in n1
  // n2 is number of items in n2
  // Average Time Complexity: O(max(n1,n2))
  // Average Space Complexity: O(max(n1,n2))
  function reverse(linkedList) {
    let newLinkedList = undefined;
    for (let cursor = linkedList, i = 0; cursor !== undefined; cursor = cursor.next, ++i) {
      const newNode = { value: cursor.value, next: newLinkedList };
      newLinkedList = newNode;
    }
    return newLinkedList;
  }
  const rn1 = reverse(n1);
  const rn2 = reverse(n2);
  return reverse(sum(rn1, rn2));
}
