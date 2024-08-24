import { BenchmarkOptions } from "../../types.ts";

export type RunOptions = BenchmarkOptions & {
  sourceMaps?: boolean,
  featureFlags?: Record<string, boolean>,
  useLocal?: boolean,
  localPath?: string,
  useSources?: boolean,
  timingsReporter?: boolean,
}
