// Represents atomic operations that can be applied to a piece of data of a specific type
// TODO: in the future update object operation to strictly contain CMS operation data
type StringOperation = {
  rangeStart: number;
  rangeEnd: number;
  newValue: string;
};
type IntegerOperation = { newValue: number };
type BooleanOperation = { newValue: boolean };
type ObjectOperation = { newValue: object };
type ArrayOperation = { newValue: object };
type NoOp = {};

// atomicOperation is a single operation that can be applied in our system
type AtomicOperation =
  | { $type: "stringOperation"; stringOperation: StringOperation }
  | { $type: "integerOperation"; integerOperation: IntegerOperation }
  | { $type: "booleanOperation"; booleanOperation: BooleanOperation }
  | { $type: "objectOperation"; objectOperation: ObjectOperation }
  | { $type: "arrayOperation"; arrayOperation: ArrayOperation }
  | { $type: "noOp"; noOp: NoOp };

// operation is the atomic operation that is sent between clients and servers
export type Operation = {
  path: number[];
  operationType: "insert" | "delete";

  isNoOp: boolean;
  operation: AtomicOperation;
};

export const noOp: Operation = {
  path: [],
  operationType: "insert",
  isNoOp: true,
  operation: {
    $type: "noOp",
    noOp: {},
  },
};

// Actual OT transformation functions
export const transform = (
  a: Operation,
  b: Operation
): [Operation, Operation] => {
  const transformedPaths = transformPaths(a, b);
  [a.path, b.path] = transformedPaths;

  return [normalise(a), normalise(b)];
};

/**
 * Takes in two operations and transforms them accordingly, note that it only
 * returns the updated paths
 */
const transformPaths = (a: Operation, b: Operation): [number[], number[]] => {
  const tp = transformationPoint(a.path, b.path);
  if (!effectIndependent(a.path, b.path, tp)) {
    switch (true) {
      case a.operationType === "insert" && b.operationType === "insert":
        return transformInserts(a.path, b.path, tp);
      case a.operationType === "delete" && b.operationType === "delete":
        return transformDeletes(a.path, b.path, tp);
      case a.operationType === "insert" && b.operationType === "delete":
        return transformInsertDelete(a.path, b.path, tp);
      default:
        const result = transformInsertDelete(b.path, a.path, tp);
        result.reverse();
        return result;
    }
  }

  return [a.path, b.path];
};

/**
 * Takes 2 paths and their transformation point and transforms them as if they
 * were insertion functions
 */
const transformInserts = (
  a: number[],
  b: number[],
  tp: number
): [number[], number[]] => {
  switch (true) {
    case a[tp] > b[tp]:
      return [update(a, tp, 1), b];
    case a[tp] < b[tp]:
      return [a, update(b, tp, 1)];
    default:
      return a.length > b.length
        ? [update(a, tp, 1), b]
        : a.length < b.length
        ? [a, update(b, tp, 1)]
        : [a, b];
  }
};

/**
 * Takes 2 paths and transforms them as if they were deletion operations
 */
const transformDeletes = (
  a: number[],
  b: number[],
  tp: number
): [number[], number[]] => {
  switch (true) {
    case a[tp] > b[tp]:
      return [update(a, tp, -1), b];
    case a[tp] < b[tp]:
      return [a, update(b, tp, -1)];
    default:
      return a.length > b.length
        ? [[], b]
        : a.length < b.length
        ? [a, []]
        : [[], []];
  }
};

/**
 * Takes an insertion operation and a deletion operation and transforms them
 */
const transformInsertDelete = (
  insertOp: number[],
  deleteOp: number[],
  tp: number
): [number[], number[]] => {
  switch (true) {
    case insertOp[tp] > deleteOp[tp]:
      return [update(insertOp, tp, -1), deleteOp];
    case insertOp[tp] < deleteOp[tp]:
      return [insertOp, update(deleteOp, tp, 1)];
    default:
      return insertOp.length > deleteOp.length
        ? [[], deleteOp]
        : [insertOp, update(deleteOp, tp, 1)];
  }
};

/**
 * Updates a specific index in a path
 */
const update = (pos: number[], toChange: number, change: number) => {
  pos[toChange] += change;
  return pos;
};

/**
 * Takes in two paths and computes their transformation point
 */
const transformationPoint = (a: number[], b: number[]): number =>
  [...Array(Math.min(a.length, b.length)).keys()].find((i) => a[i] != b[i]) ??
  Math.min(a.length, b.length);

/**
 * Takes two paths and determines if their effect is independent or not
 */
const effectIndependent = (a: number[], b: number[], tp: number): boolean =>
  (a.length > tp + 1 && b.length > tp + 1) ||
  (a[tp] > b[tp] && a.length < b.length) ||
  (a[tp] < b[tp] && a.length > b.length);

/**
 * Normalise turns an empty operation into a noop
 */
const normalise = (a: Operation): Operation => (a.path.length === 0 ? noOp : a);
