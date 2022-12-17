import { describe, expect, it } from 'vitest';
import fc from 'fast-check';

// Tests

describe.each([[sortStackBubble], [sortStackInsertion]])('%o', (run) => {
  it('should be able to sort the stack', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (data) => {
        const stack = [...data];
        run(stack);
        expect(stack).toEqual([...data].sort((a, b) => a - b));
      })
    );
  });
});

// Implementations

function sortStackBubble(stack) {
  // n is the number of items in the stack
  // Average Time Complexity: O(n**2)
  // Average Space Complexity: O(n)

  const bufferStack = [];
  while (true) {
    let performedOnceExchange = false;

    // Perform one "bubbling"
    while (stack.length !== 0 /* !stack.isEmpty() */) {
      const head = stack.pop();
      if (stack.length !== 0 /* !stack.isEmpty() */) {
        const nextHead = stack.at(-1); // stack.peek()
        if (nextHead <= head) {
          bufferStack.push(head);
        } else {
          performedOnceExchange = true;
          stack.pop();
          stack.push(head);
          bufferStack.push(nextHead);
        }
      } else {
        bufferStack.push(head);
      }
    }

    // Move back the buffered data to the original array
    while (bufferStack.length !== 0 /* !bufferStack.isEmpty() */) {
      stack.push(bufferStack.pop());
    }

    // If no exchange then our array is already sorted
    if (!performedOnceExchange) {
      return;
    }
  }
}

function sortStackInsertion(stack) {
  // n is the number of items in the stack
  // Average Time Complexity: O(n**2)
  // Average Space Complexity: O(n)

  const bufferStack = [];

  // Move all the data of the original stack to our buffer
  while (stack.length !== 0 /* !stack.isEmpty() */) {
    bufferStack.push(stack.pop());
  }

  // Insert one item (from the buffer) at a time within the already sorted stack
  while (bufferStack.length !== 0 /* !bufferStack.isEmpty() */) {
    const toBeInserted = bufferStack.pop();
    let numElementsHigher = 0;
    while (stack.length !== 0 && stack.at(-1) >= toBeInserted) {
      ++numElementsHigher;
      bufferStack.push(stack.pop());
    }
    stack.push(toBeInserted);
    for (let numReinserted = 0; numReinserted !== numElementsHigher; ++numReinserted) {
      stack.push(bufferStack.pop());
    }
  }
}
