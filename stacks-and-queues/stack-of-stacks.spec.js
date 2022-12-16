import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[buildStackOfStacks]])('%o', (run) => {
  it('should behave like a normal stack', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 0x7fffffff }),
        fc.commands([fc.integer().map((value) => new PushCommand(value)), fc.constant(new PopCommand())]),
        (maxHeight, commands) => {
          const s = () => ({
            model: { data: [], maxHeight },
            real: run(maxHeight),
          });
          fc.modelRun(s, commands);
        }
      )
    );
  });

  it('should have readAtIndex capability', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 0x7fffffff }),
        fc.commands([
          fc.anything().map((value) => new PushCommand(value)),
          fc.constant(new PopCommand()),
          fc.nat().map((unsafeIndex) => new ReadAtIndexCommand(unsafeIndex)),
          fc.constant(new ConformityChecksCommand()),
        ]),
        (maxHeight, commands) => {
          const s = () => ({
            model: { data: [], maxHeight },
            real: run(maxHeight),
          });
          fc.modelRun(s, commands);
        }
      )
    );
  });
});

// Helpers

class PushCommand {
  constructor(value) {
    this.value = value;
  }
  check(m) {
    return true;
  }
  run(m, r) {
    m.data.push(this.value);
    r.push(this.value);
  }
  toString = () => `push(${fc.stringify(this.value)})`;
}
class PopCommand {
  constructor() {}
  check(m) {
    return m.data.length > 0;
  }
  run(m, r) {
    const outModel = m.data.pop();
    const outReal = r.pop();
    expect(outReal).toBe(outModel);
  }
  toString = () => `pop()`;
}
class ReadAtIndexCommand {
  constructor(unsafeIndex) {
    this.unsafeIndex = unsafeIndex;
  }
  check(m) {
    return m.data.length > 0;
  }
  run(m, r) {
    const index = this.unsafeIndex % m.data.length;
    const outModel = m.data[index];
    const outReal = r.readAtIndex(index);
    expect(outReal).toBe(outModel);
  }
  toString = () => `readAtIndex(${this.unsafeIndex})`;
}
class ConformityChecksCommand {
  constructor() {}
  check(m) {
    return true;
  }
  run(m, r) {
    for (let index = 0; index < r._stacks.length - 1; ++index) {
      expect(r._stacks[index]).toHaveLength(m.maxHeight);
    }
    if (r._stacks.length !== 0) {
      expect(r._stacks.at(-1).length).toBeGreaterThan(0);
      expect(r._stacks.at(-1).length).toBeLessThanOrEqual(m.maxHeight);
    }
  }
  toString = () => `<conformity checks>`;
}

// Implementations

function buildStackOfStacks(maxHeight) {
  const stacks = [];

  return {
    push: (item) => {
      // Average Time Complexity: O(1)
      if (stacks.length === 0 || stacks.at(-1).length === maxHeight) {
        // We need a new stack as last one is full
        stacks.push([item]);
      } else {
        // We add one more item on top of the last stack
        stacks.at(-1).push(item);
      }
    },
    pop: () => {
      // Average Time Complexity: O(1)
      const out = stacks.at(-1).pop(); // No handling of call to pop for empty stack
      if (stacks.at(-1).length === 0) {
        stacks.pop();
      }
      return out;
    },
    readAtIndex: (index) => {
      // n is the total number of items stored cross-stacks
      // h is maxHeight
      // Average Time Complexity: O(n/h) + O(h) = O(n)
      // Average Space Complexity: O(n/h) + O(h) = O(n)

      // Compute the location of the item
      const stackIndex = Math.floor(index / maxHeight);
      const itemIndex = index % maxHeight;

      // Unpile anything blocking access to it
      const unpiledStacks = [];
      const unpiledItems = [];
      while (stacks.length > stackIndex + 1) {
        unpiledStacks.push(stacks.pop());
      }
      while (stacks.at(-1).length > itemIndex + 1) {
        unpiledItems.push(stacks.at(-1).pop());
      }
      const value = stacks.at(-1).at(-1);

      // Pile back all items
      while (unpiledItems.length !== 0) {
        stacks.at(-1).push(unpiledItems.pop());
      }
      while (unpiledStacks.length !== 0) {
        stacks.push(unpiledStacks.pop());
      }

      // We can return the value safely
      return value;
    },
    _stacks: stacks,
  };
}
