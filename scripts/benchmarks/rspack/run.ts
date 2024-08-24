import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import { rspack } from '@rspack/core'
import { BenchmarkOptions, BenchmarkResult } from '../benchmark.js'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

export async function run(options: BenchmarkOptions): Promise<BenchmarkResult> {
  fs.rmSync(path.join(__dirname, 'dist'), { force: true, recursive: true })

  const startTime = Date.now()

  const compiler = rspack({
      mode: 'production',
      entry: options.entries,
      output: {
        path: path.join(__dirname, 'dist'),
      },
      devtool: false,
      optimization: {
        minimize: options.optimize
    },
  });
  
  await new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if (err) {
        rej(err)
      } else {
        res(stats)
      }
    });
  })
  
  return {
    enabled: true,
    time: Date.now() - startTime
  }
}

// console.log(await run({
//   entries: [path.join(__dirname, '../../../src/index_1.js')],
// }))