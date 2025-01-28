type Input = RecordUnknown | ArrayUnknown | null;
type RecordUnknown = Record<string, unknown>;
type ArrayUnknown = Array<unknown>;
type ObjectsDiff = {
    values: RecordUnknown;
    paths: string[];
};

type DiffResult = {
    left: RecordUnknown | ArrayUnknown;
    right: RecordUnknown | ArrayUnknown;
};
type DiffValuesResult = {
    changed: RecordUnknown | ArrayUnknown;
    added: RecordUnknown | ArrayUnknown;
    deleted: RecordUnknown | ArrayUnknown;
};
type DiffPathsResult = {
    changed: string[];
    added: string[];
    deleted: string[];
};
type PathsResult = {
    addedAndChanged: ObjectsDiff;
    deletedAndChanged: ObjectsDiff;
    changedPaths: string[];
    addedPaths: string[];
    deletedPaths: string[];
};
declare const getLibVersion: () => string;
declare function diff(original: Input, current: Input): DiffResult;
declare function diffValues(original: Input, current: Input): DiffValuesResult;
declare function diffPaths(original: Input, current: Input): DiffPathsResult;
declare function revert(dest: Input, src: Input, customizer: (d: unknown, s: unknown) => unknown): RecordUnknown | ArrayUnknown;
declare function getPaths(obj: Input): string[];
declare function omitPaths(obj: Input, excludedPaths: string[]): RecordUnknown | ArrayUnknown;

export { type DiffPathsResult, type DiffResult, type DiffValuesResult, type PathsResult, diff, diffPaths, diffValues, getLibVersion, getPaths, omitPaths, revert };
