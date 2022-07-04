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

type ObjectOrArray = Object | Array<any>;

export function diff(original: ObjectOrArray, current: ObjectOrArray): DiffResult;
export function diffValues(original: ObjectOrArray, current: ObjectOrArray): DiffValuesResult;
export function diffPaths(original: ObjectOrArray, current: ObjectOrArray): DiffPathsResult;
export function revert(dest: ObjectOrArray, src: ObjectOrArray, customizer: (destVal: any, srcVal: any) => any): ObjectOrArray;
export function getPaths(obj: ObjectOrArray): string[];
export function omitPaths(obj: ObjectOrArray, excludedPaths: string[]): ObjectOrArray;
