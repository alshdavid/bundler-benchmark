export type BenchmarkOptions = {
  entries: Array<string>,
  optimize: boolean,
  sourceMaps: boolean,
}

export type BenchmarkResult = {
  time: number
}

export type BenchFunc = (options: BenchmarkOptions) => Promise<BenchmarkResult>

export type BenchConfig = {
  entryType: 'static' | 'dynamic'
  entries: Array<string>
  optimize: boolean
  targets: Record<string, boolean>,
  options: Record<string, Record<string, any>>
}