export type BenchmarkOptions = {
  entries: Array<string>,
  optimize: boolean,
}

export type BenchmarkResult = {
  time: number
}

export type BenchFunc = (options: BenchmarkOptions) => Promise<BenchmarkResult>

export type BenchConfig = {
  entries: Array<string>
  optimize: boolean
  targets: Record<string, boolean>,
  options: Record<string, Record<string, any>>
}