import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[nodesAtDepth]])('%o', (run) => {
  it('should only have the root node for depth 0', () => {
    fc.assert(
      fc.property(
        fc.letrec((tie) => ({
          tree: fc.record({
            value: fc.nat(),
            left: fc.option(tie('tree'), { nil: undefined, depthIdentifier: 'tree' }),
            right: fc.option(tie('tree'), { nil: undefined, depthIdentifier: 'tree' }),
          }),
        })).tree,
        (tree) => {
          const atDepth = run(tree);
          expect(atDepth[0]).toHaveLength(1);
          expect(atDepth[0][0]).toBe(tree);
        }
      )
    );
  });

  it('should associated nodes to the right depth', () => {
    fc.assert(
      fc.property(
        fc.letrec((tie) => ({
          tree: fc.record({
            value: fc.nat(),
            left: fc.option(tie('tree'), { nil: undefined, depthIdentifier: 'tree' }),
            right: fc.option(tie('tree'), { nil: undefined, depthIdentifier: 'tree' }),
          }),
        })).tree,
        (tree) => {
          const atDepth = run(tree);

          function findDepthForNode(target, current, depth) {
            if (current === undefined) {
              return -1;
            }
            if (current === target) {
              return depth;
            }
            const targetInLeft = findDepthForNode(target, current.left, depth + 1);
            if (targetInLeft !== -1) {
              return targetInLeft;
            }
            return findDepthForNode(target, current.right, depth + 1);
          }
          for (let depth = 0; depth !== atDepth.length; ++depth) {
            for (const node of atDepth[depth]) {
              expect(findDepthForNode(node, tree, 0)).toBe(depth);
            }
          }
        }
      )
    );
  });
});

// Implementations

function nodesAtDepth(tree) {
  // n is the number of nodes in the tree
  // Average Time Complexity: O(n)
  // Average Space Complexity: O(n)

  const atDepth = [];
  function fillNodesAtDepth(tree, depth) {
    if (tree === undefined) {
      return;
    }
    if (atDepth[depth] === undefined) {
      atDepth[depth] = [];
    }
    atDepth[depth].push(tree);
    fillNodesAtDepth(tree.left, depth + 1);
    fillNodesAtDepth(tree.right, depth + 1);
  }
  fillNodesAtDepth(tree, 0);
  return atDepth;
}
