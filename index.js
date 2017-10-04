'use strict';

const fs = require('fs');
const profiler = require('bindings')('sampling_heap_profiler');
let profiling = false;

module.exports.start = () => {
  if (!profiling) {
    profiler.startSamplingHeapProfiler();
    profiling = true;
  }
};

module.exports.stop = () => {
  if (profiling) {
    profiler.stopSamplingHeapProfiler();
    profiling = false;
  }
};


module.exports.write = (filename, cb) => {
  if (!profiling) {
    setImmediate(() => {
      cb(new Error('profiler not running'));
    });
    return;
  }

  if (typeof filename === 'function') {
    cb = filename;
    filename = `heap-profile-${Date.now()}.heapprofile`;
  }

  const result = profiler.getAllocationProfile();
  const devtoolsFormat = translateToDevtools(result);
  fs.writeFile(filename, JSON.stringify({head: devtoolsFormat}), (err) => {
    if (err) {
      cb(err);
      return;
    }

    cb(null, filename);
  });
};

function translateToDevtools(node) {
  const result = {};
  result.functionName = node.name;
  result.scriptId = node.scriptId;
  result.lineNumber = node.lineNumber;
  result.columnNumber = node.columnNumber;
  result.url = node.scriptName;
  result.selfSize = node.allocations.reduce(function(sum, alloc) {
    return sum + alloc.size * alloc.count;
  }, 0);
  result.children = node.children.map(translateToDevtools);
  return result;
}
