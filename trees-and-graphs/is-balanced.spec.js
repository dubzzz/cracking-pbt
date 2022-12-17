import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[isBalanced], [isBalancedIterative]])('%o', (run) => {
  it('should detect balanced trees (at most 1 depth-gap between left and right)', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 10 }).chain((n) => balancedTree(n)),
        (tree) => {
          expect(run(tree)).toBe(true);
        }
      )
    );
  });

  it('should detect unbalanced trees (strictly more than 1 depth-gap between left and right)', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 8 }).chain((n) => simpleUnbalancedTree(n)),
        (tree) => {
          expect(run(tree)).toBe(false);
        }
      )
    );
  });

  it('should detect complex unbalanced trees (strictly more than 1 depth-gap between left and right)', () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.nat({ max: 4 }), fc.nat({ max: 4 })).chain(([n1, n2]) => unbalancedTree(n1, n2)),
        (tree) => {
          expect(run(tree)).toBe(false);
        }
      )
    );
  });
});

// Helpers

function balancedTree(n) {
  return fc.letrec((tie) => ({
    tree: fc.record({ value: fc.nat(), left: tie('branch'), right: tie('branch') }),
    // First option with weight=0 and maxDepth=n allows us to define a structure with all leafs (aka last) at the same depth
    branch: fc.oneof({ maxDepth: n }, { arbitrary: tie('last'), weight: 0 }, tie('tree')),
    last: fc.record({ value: fc.nat(), left: tie('oneLeafOrNothing'), right: tie('oneLeafOrNothing') }),
    oneLeafOrNothing: fc.option(fc.record({ value: fc.nat() }), { nil: undefined }),
  })).tree;
}

function simpleUnbalancedTree(n) {
  // left or right will be at least +2 in depth
  return fc.oneof(
    fc.record({ value: fc.nat(), left: balancedTree(n), right: balancedTree(n + 2) }),
    fc.record({ value: fc.nat(), left: balancedTree(n + 2), right: balancedTree(n) })
  );
}

function unbalancedTree(n1, n2) {
  // Starting at depth n1, we will be able to find unbalanced paths
  // but left and right might have the exact same depth with that builder
  return fc.letrec((tie) => ({
    tree: fc.record({ value: fc.nat(), left: tie('branch'), right: tie('branch') }),
    branch: fc.oneof({ maxDepth: n1 }, { arbitrary: simpleUnbalancedTree(n2), weight: 0 }, tie('tree')),
  })).tree;
}

// Implementations

function isBalanced(tree) {
  // n is the number of nodes in the tree
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(log n) (for the stack)

  function computeDepthWhileBalanced(tree) {
    if (tree === undefined) {
      return { balanced: true, depth: 0 };
    }
    const leftTreeInfo = computeDepthWhileBalanced(tree.left);
    if (!leftTreeInfo.balanced) {
      return leftTreeInfo;
    }
    const rightTreeInfo = computeDepthWhileBalanced(tree.right);
    if (!rightTreeInfo.balanced) {
      return rightTreeInfo;
    }
    if (Math.abs(leftTreeInfo.depth - rightTreeInfo.depth) > 1) {
      return { balanced: false };
    }
    return { balanced: true, depth: Math.max(leftTreeInfo.depth, rightTreeInfo.depth) + 1 };
  }
  return computeDepthWhileBalanced(tree).balanced;
}

function isBalancedIterative(tree) {
  // n is the number of nodes in the tree
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(log n)

  const stack = [{ tree, depthRef: {} }];
  while (stack.length !== 0) {
    const it = stack.pop();
    if (typeof it === 'function') {
      const balanced = it();
      if (!balanced) {
        return false;
      }
    } else if (it.tree === undefined) {
      it.depthRef.depth = 0;
    } else {
      const depthLeftRef = {};
      const depthRightRef = {};
      stack.push(() => {
        it.depthRef.depth = Math.max(depthLeftRef.depth, depthRightRef.depth) + 1;
        return Math.abs(depthLeftRef.depth - depthRightRef.depth) <= 1;
      });
      stack.push({ tree: it.tree.left, depthRef: depthLeftRef });
      stack.push({ tree: it.tree.right, depthRef: depthRightRef });
    }
  }
  return true;
}
