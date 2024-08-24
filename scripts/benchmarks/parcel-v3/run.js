import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import * as os from 'node:os'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

  let configPath
  if (options.useLocal) {
    configPath = path.join(localPath, 'packages', 'configs', 'default', 'index.json')
  } else {
    configPath = path.join(__dirname, '..', '..', '..', 'node_modules', '@parcel', 'config-default', 'index.json')
  }
  
  /** @type {typeof import('@parcel/core')} */
  let ParcelCore
  if (options.useLocal && useSources) {
    console.log('parcel (sources)')
    ParcelCore = (await import(path.join(localPath, 'packages', 'core', 'core', 'src', 'index.js'))).default
  } else if (options.useLocal) {
    console.log('parcel (local)')
    ParcelCore = (await import(path.join(localPath, 'packages', 'core', 'core', 'lib', 'index.js'))).default
  } else {
    // @ts-expect-error
    ParcelCore = (await import('@parcel/core/lib/index.js')).default
  }

  const startTime = Date.now()

  const parcel = new ParcelCore.Parcel({
    shouldDisableCache: true,
    entries: options.entries,
    // NOTE, native cannot yet resolve "extends" in .parcelrc
    config: configPath,
    cacheDir: path.join(__dirname, '.parcel-cache'),
    additionalReporters: options.timingsReporter ? [
      {
        packageName: "./reporter.cjs",
        resolveFrom: __filename
      }
    ] : [],
    defaultTargetOptions: {
      shouldOptimize: !!options.optimize,
      sourceMaps: !!options.sourceMaps,
      distDir: path.join(__dirname, 'dist'),
      outputFormat: 'esmodule',
      engines: {
        browsers: ['last 1 Chrome version']
      }
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
    time: Date.now() - startTime
  }
}

if (process.argv[2] && process.argv[2] !== 'build') {
  const options = JSON.parse(atob(process.argv[2]))
  const result = await run(options)
} 

if (process.argv[2] && process.argv[2] === 'build') {
  let entry = process.argv[3]
  if (!path.isAbsolute(entry)) {
    entry = path.join(process.cwd(), entry)
  }
  console.log(entry)
  const result = await run({
    entries: [entry],
    optimize: false,
    sourceMaps: false,
  })
  console.log(result)
}