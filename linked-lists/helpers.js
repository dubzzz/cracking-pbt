export function toLinkedList(data) {
  if (data.length === 0) return undefined;
  const rootNode = { value: data[0], next: undefined };
  let previousNode = rootNode;
  for (let index = 1; index !== data.length; ++index) {
    const currentNode = { value: data[index], next: undefined };
    previousNode.next = currentNode;
    previousNode = currentNode;
  }
  return rootNode;
}
