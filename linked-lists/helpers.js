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

export function fromLinkedList(linkedList) {
  const data = [];
  for (let cursor = linkedList, i = 0; cursor !== undefined; cursor = cursor.next, ++i) {
    data.push(cursor.value);
  }
  return data;
}
