import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[buildThreeStacks]])('%o', (run) => {
  class PushCommand {
    constructor(stackIndex, value) {
      this.stackIndex = stackIndex;
      this.value = value;
    }
    check(m) {
      return m.stacks[this.stackIndex] < m.maxStackSize;
    }
    run(m, r) {
      m.stacks[this.stackIndex].push(this.value);
      r[this.stackIndex].push(this.value);
    }
    toString = () => `push@${this.stackIndex}(${this.value})`;
  }
  class PopCommand {
    constructor(stackIndex) {
      this.stackIndex = stackIndex;
    }
    check(m) {
      return m.stacks[this.stackIndex] > 0;
    }
    run(m, r) {
      const outModel = m.stacks[this.stackIndex].pop();
      const outReal = r[this.stackIndex].pop();
      expect(outReal).toBe(outModel);
    }
    toString = () => `pop@${this.stackIndex}()`;
  }

  it('should behave like three independent and capped stacks', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: Math.floor(0x7fffffff / 3) }),
        fc.commands([
          fc.tuple(fc.nat({ max: 2 }), fc.anything()).map(([stackIndex, value]) => new PushCommand(stackIndex, value)),
          fc.nat({ max: 2 }).map((stackIndex) => new PopCommand(stackIndex)),
        ]),
        (N, commands) => {
          const s = () => ({
            model: { stacks: [[], [], []], maxStackSize: N },
            real: run(N),
          });
          fc.modelRun(s, commands);
        }
      )
    );
  });
});

// Implementations

function buildThreeStacks(N) {
  const data = Array.from({ length: 3 * N });

  function buildOneStack(startIndex) {
    let stackPointer = startIndex; // items are stored within startIndex(included) to stackPointer(excluded)
    return {
      push: (item) => {
        // Average Time Complexity: O(1)
        if (stackPointer === startIndex + N) {
          throw new Error('Out of memory');
        }
        data[stackPointer] = item;
        stackPointer += 1;
      },
      pop: () => {
        // Average Time Complexity: O(1)
        if (stackPointer === startIndex) {
          throw new Error('Out of memory');
        }
        stackPointer -= 1;
        const item = data[stackPointer];
        data[stackPointer] = undefined;
        return item;
      },
    };
  }

  return [buildOneStack(0), buildOneStack(N), buildOneStack(2 * N)];
}
