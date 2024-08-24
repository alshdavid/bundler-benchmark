import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import * as esbuild from 'esbuild'
import { BenchmarkOptions, BenchmarkResult } from '../benchmark.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export async function run(options: BenchmarkOptions): Promise<BenchmarkResult> {
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
    enabled: true,
    time: Date.now() - startTime
  }
}

// console.log(await run({
//   entries: [path.join(__dirname, '../../../src/index_1.js')],
// }))