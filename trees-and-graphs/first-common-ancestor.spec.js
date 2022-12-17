import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[firstCommonAncestor]])('%o', (run) => {
  it('should be able to find the an ancestor of the first node', () => {
    fc.assert(
      fc.property(tree(), fc.nat(), fc.nat(), (tree, selectedA, selectedB) => {
        const allNodes = flatten(tree);
        const nodeA = allNodes[selectedA % allNodes.length];
        const nodeB = allNodes[selectedB % allNodes.length];
        const commonAncestor = run(tree, nodeA, nodeB);
        expect(contains(commonAncestor, nodeA)).toBe(true);
      })
    );
  });

  it('should be able to find the an ancestor of the second node', () => {
    fc.assert(
      fc.property(tree(), fc.nat(), fc.nat(), (tree, selectedA, selectedB) => {
        const allNodes = flatten(tree);
        const nodeA = allNodes[selectedA % allNodes.length];
        const nodeB = allNodes[selectedB % allNodes.length];
        const commonAncestor = run(tree, nodeA, nodeB);
        expect(contains(commonAncestor, nodeB)).toBe(true);
      })
    );
  });

  it('should be able to find the first common ancestor of both nodes', () => {
    fc.assert(
      fc.property(tree(), fc.nat(), fc.nat(), (tree, selectedA, selectedB) => {
        const allNodes = flatten(tree);
        const nodeA = allNodes[selectedA % allNodes.length];
        const nodeB = allNodes[selectedB % allNodes.length];
        const commonAncestor = run(tree, nodeA, nodeB);
        if (commonAncestor === nodeA || commonAncestor === nodeB) {
          // cannot be deeper in the tree, just making sure its a common ancestor for both nodes
          expect(contains(commonAncestor, nodeA)).toBe(true);
          expect(contains(commonAncestor, nodeB)).toBe(true);
        } else if (contains(commonAncestor.left, nodeA)) {
          // if node A is in left, node B must be in right otherwise there is a deeper common ancestor
          expect(contains(commonAncestor.right, nodeB)).toBe(true);
        } else {
          // if node A is in right, node B must be in left otherwise there is a deeper common ancestor
          expect(contains(commonAncestor.left, nodeB)).toBe(true);
          expect(contains(commonAncestor.right, nodeA)).toBe(true);
        }
      })
    );
  });
});

// Helper

function tree() {
  return fc.letrec((tie) => ({
    tree: fc.record({
      value: fc.nat(),
      left: fc.option(tie('tree'), { nil: undefined, depthIdentifier: 'tree' }),
      right: fc.option(tie('tree'), { nil: undefined, depthIdentifier: 'tree' }),
    }),
  })).tree;
}

function flatten(tree) {
  if (tree === undefined) {
    return [];
  }
  return [tree, ...flatten(tree.left), ...flatten(tree.right)];
}

function contains(tree, node) {
  if (tree === undefined) {
    return false;
  }
  return tree === node || contains(tree.left, node) || contains(tree.right, node);
}

// Implementations

function firstCommonAncestor(tree, nodeA, nodeB) {
  // n is the number of nodes in the tree
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(log n)

  function rec(current) {
    if (current === undefined) {
      return { hasA: false, hasB: false, commonAncestor: undefined };
    }
    const leftRec = rec(current.left);
    if (leftRec.commonAncestor !== undefined) {
      return leftRec;
    }
    const rightRec = rec(current.right);
    if (rightRec.commonAncestor !== undefined) {
      return rightRec;
    }
    const hasA = current === nodeA || leftRec.hasA || rightRec.hasA;
    const hasB = current === nodeB || leftRec.hasB || rightRec.hasB;
    const commonAncestor = hasA && hasB ? current : undefined;
    return { hasA, hasB, commonAncestor };
  }
  return rec(tree).commonAncestor;
}
