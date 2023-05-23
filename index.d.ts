type DiffResult = {
  left: Record<string, any>
  right: Record<string, any>
}

type DiffValuesResult = {
  changed: Record<string, any>
  added: Record<string, any>
  deleted: Record<string, any>
}

type DiffPathsResult = {
  changed: string[]
  added: string[]
  deleted: string[]
}

type Input = Record<string, any> | Array<any> | null

export function diff(original: Input, current: Input): DiffResult
export function diffValues(original: Input, current: Input): DiffValuesResult
export function diffPaths(original: Input, current: Input): DiffPathsResult
export function revert(dest: Input, src: Input, customizer: (destVal: any, srcVal: any) => any): Input
export function getPaths(obj: Input): string[]
export function omitPaths(obj: Input, excludedPaths: string[]): Input
