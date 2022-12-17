import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[nextSearchNode]])('%o', (run) => {
  it('should be able to find the next node in a binary search tree', () => {
    fc.assert(
      fc.property(fc.uniqueArray(fc.integer(), { minLength: 1 }), fc.nat(), (data, selected) => {
        const tree = createTree(data);

        const sortedData = [...data].sort((a, b) => a - b);
        const safeSelected = selected % sortedData.length;
        const node = extractNode(tree, sortedData[safeSelected]);
        expect(run(node)).toBe(extractNode(tree, sortedData[safeSelected + 1]));
      })
    );
  });
});

// Helper

function createTree(data) {
  const root = { value: data[0] };

  function addNode(current, nodeValue) {
    if (current.value >= nodeValue) {
      if (current.left === undefined) {
        current.left = { value: nodeValue, parent: current };
      } else {
        addNode(current.left, nodeValue);
      }
    } else {
      if (current.right === undefined) {
        current.right = { value: nodeValue, parent: current };
      } else {
        addNode(current.right, nodeValue);
      }
    }
  }

  for (let index = 1; index !== data.length; ++index) {
    addNode(root, data[index]);
  }
  return root;
}

function extractNode(tree, nodeValue) {
  if (tree === undefined) {
    return undefined;
  } else if (tree.value === nodeValue) {
    return tree;
  } else if (tree.value > nodeValue) {
    return extractNode(tree.left, nodeValue);
  } else {
    return extractNode(tree.right, nodeValue);
  }
}

// Implementations

function nextSearchNode(node) {
  // n is the number of nodes in the tree containing node
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(log n)

  if (node.right !== undefined) {
    let current = node.right;
    while (current.left !== undefined) {
      current = current.left;
    }
    return current;
  } else if (node.parent !== undefined) {
    let previous = node;
    let current = node.parent;
    while (current !== undefined && current.left !== previous) {
      previous = current;
      current = current.parent;
    }
    return current;
  }
}
