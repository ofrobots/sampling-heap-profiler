{
  "targets": [
    {
      "target_name": "sampling_heap_profiler",
      "sources": [ "bindings/sampling-heap-profiler.cc" ],
      "include_dirs": [ "<!(node -e \"require('nan')\")" ]
    },
  ]
}