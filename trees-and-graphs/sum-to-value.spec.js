import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[sumToValue]])('%o', (run) => {
  it('should only returns paths resulting to the requested value', () => {
    fc.assert(
      fc.property(tree(), fc.integer(), (tree, value) => {
        const paths = run(tree, value);
        for (const path of paths) {
          expect(path.map((node) => node.value).reduce((a, b) => a + b, 0)).toBe(value);
        }
      })
    );
  });

  it('should always find one path when there a known one', () => {
    fc.assert(
      fc.property(tree(), fc.nat(), fc.nat(), fc.context(), (tree, selectedA, selectedB) => {
        const allNodes = flatten(tree);
        const nodeA = allNodes[selectedA % allNodes.length];
        const nodeB = allNodes[selectedB % allNodes.length];
        const pathToNodeA = pathTo(tree, nodeA);
        const pathToNodeB = pathTo(tree, nodeB);
        const index =
          pathToNodeA.length - [...pathToNodeA].reverse().findIndex((node) => pathToNodeB.includes(node)) - 1;
        const pathFromAToB = [...pathToNodeA.slice(index).reverse(), ...pathToNodeB.slice(index + 1)];
        const targetValue = pathFromAToB.map((node) => node.value).reduce((a, b) => a + b, 0);
        const paths = run(tree, targetValue);
        expect(paths.length).toBeGreaterThan(0);
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

function pathTo(tree, node) {
  if (tree === undefined) {
    return undefined;
  }
  if (tree === node) {
    return [tree];
  }
  const left = pathTo(tree.left, node);
  if (left !== undefined) {
    return [tree, ...left];
  }
  const right = pathTo(tree.right, node);
  if (right !== undefined) {
    return [tree, ...right];
  }
  return undefined;
}

// Implementations

function sumToValue(tree, value) {
  // n is the number of nodes in the tree
  // Average Time Complexity: O(n)

  function rec(current) {
    if (current === undefined) {
      return { subSums: [], paths: [] };
    }
    const left = rec(current.left);
    const right = rec(current.right);
    const subSums = [
      { value: current.value, nodes: [current] },
      ...left.subSums.map((sum) => ({
        value: sum.value + current.value,
        nodes: [...sum.nodes, current],
      })),
      ...right.subSums.map((sum) => ({
        value: sum.value + current.value,
        nodes: [current, ...sum.nodes],
      })),
    ];
    const paths = [
      ...left.paths,
      ...right.paths,
      ...subSums.filter((sum) => sum.value === value).map((sum) => sum.nodes),
    ];
    for (const sumLeft of left.subSums) {
      for (const sumRight of right.subSums) {
        if (sumLeft.value + current.value + sumRight.value === value) {
          paths.push([...sumLeft.nodes, current, ...sumRight.nodes]);
        }
      }
    }
    return { subSums, paths };
  }
  return rec(tree).paths;
}
