
set -x
cd github/sampling-heap-profiler

node -p process.versions
npm install
npm run test
