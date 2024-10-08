import * as fs from 'node:fs'
import * as child_process from 'node:child_process'
import * as path from 'node:path'
import * as url from 'node:url'
import YAML from 'yaml'
import { type } from 'node:os'

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
  if (!fs.existsSync(path.join(__dirname, '..', 'bench.custom.yml'))) {
    fs.cpSync(path.join(__dirname, '..', 'bench.yml'), path.join(__dirname, '..', 'bench.custom.yml'))
  }
  configPath = path.join(__dirname, '..', 'bench.custom.yml') 
}

/** @type {import('./types.ts').BenchConfig} */
const config = YAML.parse(fs.readFileSync(configPath, 'utf8'))

console.log(YAML.stringify(config, null, 2))

fs.rmSync(path.join(__dirname, '..', 'report.csv'), { force: true, recursive: true })

const base = config.entryType === 'static' 
  ? '_entries_static'
  : '_entries_dynamic'

for (const [benchmark, enabled] of Object.entries(config.targets)) {
  if (!enabled) continue

  console.log(benchmark)
  for (const entry of config.entries) {
    const startTime = Date.now()
    
    useSpawnSync('node', [
      '--max-old-space-size=7168', 
      path.join(__dirname, "benchmarks", benchmark, "run.js"),
      btoa(JSON.stringify({
        entries: [path.join(__dirname, '..', 'src', base, `index_${entry}.js`)],
        optimize: config.optimize,
        ...(config.options[benchmark] || {})
      }))])

    const duration = Date.now() - startTime

    fs.appendFileSync(path.join(__dirname, '..', 'report.csv'), `${benchmark},${entry},${duration}\n`)
    console.log(`  ${entry.padStart(2)}: ${duration}ms`)
  }
}

function useSpawnSync(/** @type {string} */ cmd, /** @type {string[]} */ args) {
  const processResult = child_process.spawnSync(
      cmd,
      args,
      {
          encoding: 'utf8',
          shell: true,
          stdio: 'inherit'
      }
  );
  return processResult.stdout
}