type Format =
  | 'diff'
  | 'values'
  | 'paths';

interface DiffResult {
  left: object;
  right: object;
}

interface ValuesResult {
  changed: object;
  added: object;
  deleted: object;
}

interface PathsResult {
  changedPaths: string[];
  addedPaths: string[];
  deletedPaths: string[];
}

type Result =
  | DiffResult
  | ValuesResult
  | PathsResult;

declare function o2diff(original: object, current: object, format: Format): PathsResult;
export = o2diff;
