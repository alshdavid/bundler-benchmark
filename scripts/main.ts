import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import { BenchFunc } from './benchmarks/benchmark.js'

let __dirname = path.dirname(url.fileURLToPath(import.meta.url))

type BenchConfig = {
  entries: Array<string>
  optimize: boolean
  targets: Record<string, boolean>,
  options: Record<string, Record<string, any>>
}

let configPath 

if (process.argv.slice(2).length) {
  if (path.isAbsolute(process.argv.slice(2)[0])) {
    configPath = process.argv.slice(2)[0]
  } else {
    configPath = path.join(process.cwd(), process.argv.slice(2)[0])
  }
} else {
  if (fs.existsSync(path.join(__dirname, '..', 'bench.custom.json'))) {
    configPath = path.join(__dirname, '..', 'bench.custom.json') 
  } else {
    configPath = path.join(__dirname, '..', 'bench.json')
  }
}

const config: BenchConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))

console.log(JSON.stringify(config, null, 2))

for (const [benchmark, enabled] of Object.entries(config.targets)) {
  if (!enabled) continue

  console.log(benchmark)
  for (const entry of config.entries) {
    const { run } = await import(path.join(__dirname, "benchmarks", benchmark, "run.ts")) as { run: BenchFunc }
    const result = await run({
      entries: [path.join(__dirname, '..', 'src', `index_${entry}.js`)],
      optimize: config.optimize,
      ...(config.options[benchmark] || {})
    })

    console.log(result)
  }
}