import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import * as esbuild from 'esbuild'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

/** @returns {Promise<import('../../types.ts').BenchmarkResult>} */
export async function run(
  /** @type {import('../../types.ts').BenchmarkOptions} */ options
) {
  fs.rmSync(path.join(__dirname, 'dist'), { force: true, recursive: true })

  const startTime = Date.now()

  await esbuild.build({
    bundle: true,
    format: 'esm',
    splitting: true,
    outdir: path.join(__dirname, 'dist'),
    entryPoints: options.entries
  });
  
  return {
    time: Date.now() - startTime
  }
}

if (process.argv[2]) {
  const options = JSON.parse(atob(process.argv[2]))
  const result = await run(options)
}
