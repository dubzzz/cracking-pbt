import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[sortedArrayToTree]])('%o', (run) => {
  it('should produce a binary tree', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer(), { minLength: 1 }), (data) => {
        const tree = run([...data].sort((a, b) => a - b));
        expect(isBinaryTree(tree)).toBe(true);
      })
    );
  });

  it('should produce a tree containing all the original nodes', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer(), { minLength: 1 }), (data) => {
        const tree = run([...data].sort((a, b) => a - b));
        const itemsInTree = extractAllItems(tree);
        expect([...itemsInTree].sort()).toEqual([...data].sort());
      })
    );
  });

  it('should produce a tree having minimal height', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer(), { minLength: 1 }), (data) => {
        const tree = run([...data].sort((a, b) => a - b));
        const height = computeHeight(tree);
        const targetHeight = Math.log(data.length) / Math.log(2);
        expect(height).toBeGreaterThanOrEqual(targetHeight);
        expect(height).toBeLessThanOrEqual(targetHeight + 1);
      })
    );
  });
});

// Helpers

function isBinaryTree(tree) {
  if (tree.left !== undefined) {
    if (tree.left > tree.value) return false;
    if (!isBinaryTree(tree.left)) return false;
  }
  if (tree.right !== undefined) {
    if (tree.right <= tree.value) return false;
    if (!isBinaryTree(tree.right)) return false;
  }
  return true;
}

function extractAllItems(tree) {
  if (tree === undefined) return [];
  return [tree.value, ...extractAllItems(tree.left), ...extractAllItems(tree.right)];
}

function computeHeight(tree) {
  if (tree === undefined) return 0;
  return Math.max(computeHeight(tree.left), computeHeight(tree.right)) + 1;
}

// Implementations

function sortedArrayToTree(data) {
  // n is data.length
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)

  function buildTree(start, end) {
    if (start >= end) {
      return undefined;
    }
    // If we wanted to handle the case of equal values, we would have to move mid to the right
    // if its neighboor is equal to it and is within the accepted range
    const mid = Math.floor((start + end) / 2);
    return {
      value: data[mid],
      left: buildTree(start, mid),
      right: buildTree(mid + 1, end),
    };
  }
  return buildTree(0, data.length);
}
