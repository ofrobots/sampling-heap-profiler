
import test from 'ava';
import * as delay from 'delay';

import * as m from '../src/index';

function findNode(
    name: string, node: m.AllocationProfileNode): m.AllocationProfileNode|null {
  if (node.name === name) return node;
  for (const child of node.children) {
    const result = findNode(name, child);
    if (result) return result;
  }
  return null;
}

function soManyAllocations() {
  for (let i = 0; i < 5000; i++) {
    const garbage = new Array(20000);
  }
}

test.serial('get without start should throw', t => {
  t.throws(() => {
    m.get();
  });
});

test.serial('get should return a valid profile', async t => {
  // Schedule some work.
  const timer = setInterval(soManyAllocations, 2);

  m.start();
  await delay(3 * 1000);
  const profile = m.get();
  const node = findNode('soManyAllocations', profile);
  t.truthy(node);

  // Cancel the scheduled work.
  clearInterval(timer);
});
