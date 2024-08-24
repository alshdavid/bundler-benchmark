import * as fs from "node:fs";
import * as path from "node:path";
import * as url from "node:url";
import { rspack } from "@rspack/core";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** @returns {Promise<import('../../types.ts').BenchmarkResult>} */
export async function run(
  /** @type {import('../../types.ts').BenchmarkOptions} */ options
) {
  fs.rmSync(path.join(__dirname, "dist"), { force: true, recursive: true });

  const startTime = Date.now();

  /** @type {import('@rspack/core').RspackOptions} */
  const config = {
    mode: "production",
    entry: options.entries,
    output: {
      path: path.join(__dirname, "dist"),
    },
    devtool: false,
    optimization: {
      minimize: options.optimize,
    },
  };

  if (options.sourceMaps) {
    config.devtool = "source-map";
  }

  const compiler = rspack(config);

  await new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if (err) {
        rej(err);
      } else {
        res(stats);
      }
    });
  });

  return {
    time: Date.now() - startTime,
  };
}

if (process.argv[2] && process.argv[2] !== "build") {
  const options = JSON.parse(atob(process.argv[2]));
  const result = await run(options);
}

if (process.argv[2] && process.argv[2] === "build") {
  let entry = process.argv[3];
  if (!path.isAbsolute(entry)) {
    entry = path.join(process.cwd(), entry);
  }
  console.log(entry);
  const result = await run({
    entries: [entry],
    optimize: false,
    sourceMaps: true,
  });
  console.log(result);
}
