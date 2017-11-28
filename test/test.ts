
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
  const A = [];
  for (let i = 0; i < 10000; i++) {
    A.push(new Array(2000));
  }
  return A;
}

test.serial('get without start should throw', t => {
  t.throws(() => {
    m.get();
  });
});

test.serial('get should return a valid profile', async t => {
  m.start();
  const garbage = soManyAllocations();
  const profile = m.get();
  const node = findNode('soManyAllocations', profile);
  t.truthy(node);
  m.stop();
});
