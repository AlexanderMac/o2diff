export type Input = RecordUnknown | ArrayUnknown | null

export type RecordUnknown = Record<string, unknown>
export type ArrayUnknown = Array<unknown>

export type ObjectsDiff = {
  values: RecordUnknown
  paths: string[]
}
