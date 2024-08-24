import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'

/** @type { string } */
let __dirname = path.dirname(url.fileURLToPath(import.meta.url))

/** @type { string } */
let configPath 

if (process.argv.slice(2).length) {
  if (path.isAbsolute(process.argv.slice(2)[0])) {
    configPath = process.argv.slice(2)[0]
  } else {
    configPath = path.join(process.cwd(), process.argv.slice(2)[0])
  }
} else {
  if (!fs.existsSync(path.join(__dirname, '..', 'bench.custom.json'))) {
    fs.cpSync(path.join(__dirname, '..', 'bench.json'), path.join(__dirname, '..', 'bench.custom.json'))
  }
  configPath = path.join(__dirname, '..', 'bench.custom.json') 
}

/** @type {import('./types.ts').BenchConfig} */
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

console.log(JSON.stringify(config, null, 2))

fs.rmSync(path.join(__dirname, '..', 'report.csv'), { force: true, recursive: true })

for (const [benchmark, enabled] of Object.entries(config.targets)) {
  if (!enabled) continue

  console.log(benchmark)
  for (const entry of config.entries) {
    /** @type {{ run: import('./types.ts').BenchFunc }} */
    const { run } = await import(path.join(__dirname, "benchmarks", benchmark, "run.js"))
    const result = await run({
      entries: [path.join(__dirname, '..', 'src', `index_${entry}.js`)],
      optimize: config.optimize,
      ...(config.options[benchmark] || {})
    })

    fs.appendFileSync(path.join(__dirname, '..', 'report.csv'), `${benchmark},${entry},${result.time}\n`)
    console.log(`  ${entry.padStart(2)}: ${result.time}ms`)
  }
}
