import test from 'ava';
import * as delay from 'delay';

test('writeAsync should write', async t => {
  // Load fs, and mock, before loading write.ts. Otherwise the value of
  // fs.writeFile gets cached in module global variable writeFilep which
  // isn't monkey patchable.
  //
  const fs = require('fs');

  const originalWriteFile = fs.writeFile;

  fs.writeFile = (
    file: string,
    data: string,
    callback: (...args: Array<{}>) => void
  ) => {
    const profile = JSON.parse(data); // should not crash.

    if (profile.head === 'profile1') {
      t.truthy(/heap-profile-\d+\.heapprofile/.test(file));
    } else {
      t.deepEqual(file, 'fake-filename');
    }

    setImmediate(callback);
  };

  const { writeAsync } = require('../src/write');

  t.plan(2);
  // Make sure we use the default pattern when filename is omitted.
  await writeAsync('profile1');
  // Make sure we write to the provided filename.
  await writeAsync('profile2', 'fake-filename');

  fs.writeFile = originalWriteFile;
});

// When adding new tests, note that writeFilep in write.ts isn't easily monkey
// patchable. It might be easier to add tests to the previous test rather than
// adding a new test.
