# Bundler Benchmarks

This will benchmark various bundlers against the three-js source code. 

To increase the difficulty of the build, the benchmark scales up the three-js source code by cloning it multiple times 

```javascript
import * as three_js_copy_1 from './copy_1/Three.js'; 
export { three_js_copy_1 }; 
window.three_js_copy_1 = three_js_copy_1;

import * as three_js_copy_2 from './copy_2/Three.js'; 
export { three_js_copy_2 }; 
window.three_js_copy_2 = three_js_copy_2;

import * as three_js_copy_3 from './copy_3/Three.js'; 
export { three_js_copy_3 }; 
window.three_js_copy_3 = three_js_copy_3;

// ... n times
```

With tests configured for `1`, `10`, `20` `30` `40` `50` copies of the three-js source code.

## Running Locally

```bash
# Install Dependencies
npm install

# Create a config to select what bundlers/settings to include
npm run configure

# Setup Config
nano bench.custom.json

# Run benchmarks
npm run bench
```

### Running One Benchmark

```bash
node --max-old-space-size=7168 ./scripts/benchmarks/parcel-v3/run.js build ./src/index_50.js
```

### Profile

Using [procmon](https://github.com/alshdavid/procmon)

```bash
procmon \
  -r m1_profile \
  -i 500 \
  --no-disk \
  -- \
    node --max-old-space-size=7168 ./scripts/benchmarks/parcel-v3/run.js build ./src/index_200.js
```