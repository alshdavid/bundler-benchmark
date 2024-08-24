import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import ParcelCore from '@parcel/core'
import ParcelFS from '@parcel/fs'
import { BenchmarkOptions, BenchmarkResult } from '../benchmark.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export type RunOptions = BenchmarkOptions & {
  sourceMaps?: boolean,
  featureFlags?: Record<string, boolean>,
}

export async function run(options: RunOptions): Promise<BenchmarkResult> {
  fs.rmSync(path.join(__dirname, 'dist'), { force: true, recursive: true })
  fs.rmSync(path.join(__dirname, '.parcel-cache'), { force: true, recursive: true })

  const startTime = Date.now()

  const parcel = new ParcelCore.Parcel({
    shouldDisableCache: true,
    entries: options.entries,
    // NOTE, native cannot yet resolve "extends" in .parcelrc
    config: path.join(__dirname, '..', '..', '..', 'node_modules', '@parcel', 'config-default', 'index.json'),
    cacheDir: path.join(__dirname, '.parcel-cache'),
    defaultTargetOptions: {
      shouldOptimize: !!options.optimize,
      sourceMaps: !!options.sourceMaps,
      distDir: path.join(__dirname, 'dist'),
      outputFormat: 'esmodule'
    },
    featureFlags: {
      ...options.featureFlags,
      parcelV3: true,
    },

    // For now
    // @ts-ignore
    nodeWorkers: 0,
  })

  await parcel.run()
  
  return {
    enabled: true,
    time: Date.now() - startTime
  }
}

// console.log(await run({
//   entries: [path.join(__dirname, '../../../src/index_1.js')],
// }))