
const assert = require('assert');
const m = require('./index.js');

function findNode(name, node) {
  if (node.name === name) return node;
  for (let child of node.children) {
    const result = findNode(name, child);
    if (result) return result;
  }
  return null;
}

function soManyAllocations() {
  for (let i = 0; i < 5000; i++) {
    new Array(20000);
  }
}

// get without start should throw
assert.throws(() => {
  m.get();
});

// get should work
(() => {
  m.start();

  // schedule some work.
  const timer = setInterval(soManyAllocations, 2);

  setTimeout(() => {
    const profile = m.get();
    // cancel the scheduled work.
    clearInterval(timer);

    const node = findNode('soManyAllocations', profile);
    assert(node);
  }, 3 * 1000);
})();