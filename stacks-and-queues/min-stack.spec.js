import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[buildMinStack]])('%o', (run) => {
  it('should behave like a normal stack', () => {
    fc.assert(
      fc.property(
        fc.commands([fc.integer().map((value) => new PushCommand(value)), fc.constant(new PopCommand())]),
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

  it('should have min capability', () => {
    fc.assert(
      fc.property(
        fc.commands([
          fc.integer().map((value) => new PushCommand(value)),
          fc.constant(new PopCommand()),
          fc.constant(new MinCommand()),
        ]),
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
class MinCommand {
  constructor() {}
  check(m) {
    return m.data.length > 0;
  }
  run(m, r) {
    const outModel = Math.min(...m.data);
    const outReal = r.min();
    expect(outReal).toBe(outModel);
  }
  toString = () => `min()`;
}

// Implementations

function buildMinStack() {
  const data = [];

  return {
    push: (item) => {
      // Average Time Complexity: O(1)
      const min = data.length !== 0 ? Math.min(data[data.length - 1].min, item) : item;
      data.push({ item, min });
    },
    pop: () => {
      // Average Time Complexity: O(1)
      return data.pop().item; // No handling of call to pop for empty stack
    },
    min: () => {
      // Average Time Complexity: O(1)
      return data[data.length - 1].min; // No handling of call to min for empty stack (could be NaN?)
    },
  };
}
