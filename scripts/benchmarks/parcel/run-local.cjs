const fs = require('node:fs')
const path = require('node:path')
// import * as url from 'node:url'
// import ParcelCore from '@parcel/core'
// import ParcelFS from '@parcel/fs'
// import type { BenchmarkOptions, BenchmarkResult } from '../benchmark.js'

// const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

// export type RunOptions = BenchmarkOptions & {
//   sourceMaps?: boolean,
//   featureFlags?: Record<string, boolean>,
//   local?: string
//   useSources?: boolean,
// }

async function run(options) {
  if (!options.local) throw new Error("No local path supplied")
  const useSources = options.useSources === undefined ? true : options.useSources

  fs.rmSync(path.join(__dirname, 'dist'), { force: true, recursive: true })
  fs.rmSync(path.join(__dirname, '.parcel-cache'), { force: true, recursive: true })

  console.log(useSources)
  if (useSources) {
    require(path.join(options.local, 'packages', 'dev', 'babel-register', 'index.js'))
  }

  console.log(path.join(options.local, 'packages', 'core', 'core', 'src', 'index.js'))
  const ParcelCore = useSources
    ? require(path.join(options.local, 'packages', 'core', 'core', 'src', 'index.js'))
    : require(path.join(options.local, 'packages', 'core', 'core', 'lib', 'index.js'))

  // console.log(ParcelCore)

  const startTime = Date.now()

  // const parcel = new ParcelCore.Parcel({
  //   shouldDisableCache: true,
  //   entries: options.entries,
  //   inputFS: new ParcelFS.NodeFS(),
  //   config: path.join(__dirname, '.parcelrc'),
  //   cacheDir: path.join(__dirname, '.parcel-cache'),
  //   defaultTargetOptions: {
  //     shouldOptimize: options.optimize,
  //     sourceMaps: options.sourceMaps,
  //     distDir: path.join(__dirname, 'dist'),
  //     outputFormat: 'esmodule'
  //   },
  //   featureFlags: options.featureFlags
  // })

  // await parcel.run()
  
  return {
    enabled: true,
    time: Date.now() - startTime
  }
}

run({
  entries: [path.join(__dirname, '../../../src/index_1.js')],
  optimize: false,
  local: "/Volumes/Storage/Development/parcel-bundler/parcel"
}).then(console.log)