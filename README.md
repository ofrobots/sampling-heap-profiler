# Sampling Heap Profiler

**EXPERIMENTAL**

This module adds supports for the experimental Sampling Heap Profiler in V8.
This works by taking a random sample of objects, as they are allocated, to keep
a statistical sample of what is live in the heap at any given time. This also
keeps track of the stack that allocated a given sampled object. This means that
you know not only what is live, but what code path allocated it. This is 
motivated by, and functions similarly to, the heap profiler built into tcmalloc.

* The generated snapshots can be opened in DevTools.
* This is supposed to be lightweight enough for in-production use on servers.

## Usage

```javascript
const heapProfile = require('heap-profile');

heapProfile.start();

// Write a snapshot to disk every hour
setInterval(() => {
  heapProfile.write((err, filename) => {
    console.log(`heapProfile.write. err: ${err} filename: ${filename}`);
  });
}, 60 * 60 * 1000).unref();
```

### start()

### stop()

### write([filename], cb)

Writes the current heap sample to a file. If the filename parameter is omitted,
a default pattern of `heap-profile-${Date.now()}.heapprofile`. 

The callback returns error if profiling was not active at the time of call.
Otherwise the name of the file is returned via the callback.