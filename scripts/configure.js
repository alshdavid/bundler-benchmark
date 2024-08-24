import * as fs from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'

/** @type { string } */
let __dirname = path.dirname(url.fileURLToPath(import.meta.url))

if (!fs.existsSync(path.join(__dirname, '..', 'bench.custom.json'))) {
  fs.cpSync(path.join(__dirname, '..', 'bench.json'), path.join(__dirname, '..', 'bench.custom.json'))
}