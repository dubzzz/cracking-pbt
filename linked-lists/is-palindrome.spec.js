import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { toLinkedList } from './helpers';

// Tests

describe.each([[isPalindrome]])('%o', (run) => {
  it('should detect palindromes', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), fc.option(fc.nat(), { nil: undefined }), (data, mid) => {
        expect(run(toLinkedList([...data, ...(mid !== undefined ? [mid] : []), ...data.reverse()]))).toBe(true);
      })
    );
  });

  it('should detect not palindrome', () => {
    fc.assert(
      fc.property(fc.array(fc.nat()), (data) => {
        fc.pre(data.join(',') !== [...data].reverse().join(','));
        expect(run(toLinkedList(data))).toBe(false);
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

function isPalindrome(linkedList) {
  // n is number of items in linkedList
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)
  function reverse(linkedList) {
    let newLinkedList = undefined;
    for (let cursor = linkedList; cursor !== undefined; cursor = cursor.next) {
      const newNode = { value: cursor.value, next: newLinkedList };
      newLinkedList = newNode;
    }
    return newLinkedList;
  }
  const reversedLinkedList = reverse(linkedList);
  let c1 = linkedList;
  let c2 = reversedLinkedList;
  for (; c1 !== undefined && c2 !== undefined; c1 = c1.next, c2 = c2.next) {
    if (c1.value !== c2.value) {
      return false;
    }
  }
  if (c1 !== undefined || c2 !== undefined) {
    return false;
  }
  return true;
}
