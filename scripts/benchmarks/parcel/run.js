import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import * as os from 'node:os'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

/** @returns {Promise<import('../../types.ts').BenchmarkResult>} */
export async function run(
  /** @type {import('./types.ts').RunOptions} */ options
) {
  fs.rmSync(path.join(__dirname, 'dist'), { force: true, recursive: true })
  fs.rmSync(path.join(__dirname, '.parcel-cache'), { force: true, recursive: true })

  // Defaults to $HOME/Development/parcel-bundler/parcel
  let localPath
  if (!options.localPath) {
    localPath = path.join(os.homedir(), 'Development', 'parcel-bundler', 'parcel')
  } else {
    localPath = options.localPath
  }

  let useSources
  if (options.useSources === undefined) {
    useSources = true
  } else {
    useSources = options.useSources
  }

  if (useSources) {
    await import(path.join(localPath, 'packages', 'dev', 'babel-register', 'index.js'))
  }

  /** @type {typeof import('@parcel/core')} */
  let ParcelCore
  if (options.useLocal && useSources) {
    console.log('parcel-v3 (sources)')
    ParcelCore = (await import(path.join(localPath, 'packages', 'core', 'core', 'src', 'index.js'))).default
  } else if (options.useLocal) {
    console.log('parcel-v3 (local)')
    ParcelCore = (await import(path.join(localPath, 'packages', 'core', 'core', 'lib', 'index.js'))).default
  } else {
    // @ts-expect-error
    ParcelCore = (await import('@parcel/core/lib/index.js')).default
  }

  const startTime = Date.now()

  const parcel = new ParcelCore.Parcel({
    shouldDisableCache: true,
    entries: options.entries,
    config: path.join(__dirname, '.parcelrc'),
    cacheDir: path.join(__dirname, '.parcel-cache'),
    defaultTargetOptions: {
      shouldOptimize: options.optimize,
      sourceMaps: options.sourceMaps,
      distDir: path.join(__dirname, 'dist'),
      outputFormat: 'esmodule'
    },
    featureFlags: options.featureFlags
  })

  await parcel.run()
  
  return {
    time: Date.now() - startTime
  }
}
