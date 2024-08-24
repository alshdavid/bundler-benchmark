export type BenchmarkOptions = {
  entries: Array<string>,
  optimize: boolean,
}

export type BenchmarkResult = {
  enabled: boolean,
  time: number
}

export type BenchFunc = (options: BenchmarkOptions) => Promise<BenchmarkResult>