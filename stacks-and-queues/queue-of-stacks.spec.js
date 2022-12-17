import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[buildQueueOfStacks]])('%o', (run) => {
  it('should behave like a normal queue', () => {
    fc.assert(
      fc.property(
        fc.commands([fc.integer().map((value) => new EnqueueCommand(value)), fc.constant(new DequeueCommand())]),
        (commands) => {
          const s = () => ({
            model: { data: [] },
            real: run(),
          });
          fc.modelRun(s, commands);
        }
      )
    );
  });
});

// Helpers

class EnqueueCommand {
  constructor(value) {
    this.value = value;
  }
  check(m) {
    return true;
  }
  run(m, r) {
    m.data.push(this.value);
    r.enqueue(this.value);
  }
  toString = () => `enqueue(${fc.stringify(this.value)})`;
}
class DequeueCommand {
  constructor() {}
  check(m) {
    return m.data.length > 0;
  }
  run(m, r) {
    const outModel = m.data.shift();
    const outReal = r.dequeue();
    expect(outReal).toBe(outModel);
  }
  toString = () => `dequeue()`;
}

// Implementations

function buildQueueOfStacks() {
  const leadingStack = [];
  const trailingStack = [];

  return {
    enqueue: (item) => {
      // Average Time Complexity: O(1)
      trailingStack.push(item);
    },
    dequeue: () => {
      // Average Time Complexity: O(n)
      if (leadingStack.length === 0) {
        while (trailingStack.length !== 0) {
          leadingStack.push(trailingStack.pop());
        }
      }
      return leadingStack.pop();
    },
  };
}
