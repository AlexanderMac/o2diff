interface DiffResult {
  left: object;
  right: object;
}

interface DiffValuesResult {
  changed: object;
  added: object;
  deleted: object;
}

interface DiffPathsResult {
  changed: string[];
  added: string[];
  deleted: string[];
}

export function diff(original: any, current: any): DiffResult;
export function diffValues(original: any, current: any): DiffValuesResult;
export function diffPaths(original: any, current: any): DiffPathsResult;
