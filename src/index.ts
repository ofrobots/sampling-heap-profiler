

import {writeAsync} from './write';

export interface Allocation {
  size: number;
  count: number;
}
export interface AllocationProfileNode {
  name?: string;
  scriptName: string;
  scriptId: number;
  lineNumber: number;
  columnNumber: number;
  allocations: Allocation[];
  children: AllocationProfileNode[];
}

const profiler = require('bindings')('sampling_heap_profiler');
let profiling = false;

export function start(cfg?: {sampleIntervalBytes: number, stackDepth: number}) {
  if (!profiling) {
    if (cfg) {
      profiler.startSamplingHeapProfiler(
          cfg.sampleIntervalBytes, cfg.stackDepth);
    } else {
      profiler.startSamplingHeapProfiler();
    }
    profiling = true;
  }
}

export function stop() {
  if (profiling) {
    profiler.stopSamplingHeapProfiler();
    profiling = false;
  }
}

export function get(): AllocationProfileNode {
  if (!profiling) {
    throw new Error('get can only be called after profiler has been started');
  }
  return profiler.getAllocationProfile();
}

export interface Callback { (err: Error|null, filename?: string): void; }

export function write(): Promise<string>;
export function write(filename: string): Promise<string>;
export function write(cb: Callback): void;
export function write(filename: string, cb: Callback): void;
export function write(
    filename?: string|Callback, cb?: Callback): Promise<string>|void {
  if (typeof filename === 'function') {
    cb = filename;
    filename = undefined;
  }

  const promise = profiling ? writeAsync(translateToDevtools(get()), filename) :
                              Promise.reject(new Error('profiler not running'));
  if (cb) {
    promise.then(cb.bind(null, null)).catch(cb);
  } else {
    return promise;
  }
}

export interface DevToolsProfileNode {
  functionName?: string;
  scriptId: number;
  lineNumber: number;
  columnNumber: number;
  url: string;
  selfSize: number;
  children: DevToolsProfileNode[];
}

function translateToDevtools(node: AllocationProfileNode): DevToolsProfileNode {
  return {
    functionName: node.name,
    scriptId: node.scriptId,
    lineNumber: node.lineNumber,
    columnNumber: node.columnNumber,
    url: node.scriptName,
    selfSize: node.allocations.reduce(
        (sum, alloc) => {
          return sum + alloc.size * alloc.count;
        },
        0),
    children: node.children.map(translateToDevtools)
  };
}
