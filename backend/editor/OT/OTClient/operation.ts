// Represents atomic operations that can be applied to a piece of data of a specific type
// TODO: in the future update object operation to strictly contain CMS operation data
export interface AtomicOperation {
  $type: string;
  transformAgainst: (op: AtomicOperation) => AtomicOperation[];
}

export class IntegerOperation implements AtomicOperation {
  $type = "integerOperation";
  newValue: number;
  constructor(newValue: number) {
    this.newValue = newValue;
  }

  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export class BooleanOperation implements AtomicOperation {
  $type = "booleanOperation";
  newValue: boolean;
  constructor(newValue: boolean) {
    this.newValue = newValue;
  }
  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export class ObjectOperation implements AtomicOperation {
  $type = "objectOperation";
  newValue: object;
  constructor(newValue: object) {
    this.newValue = newValue;
  }
  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export class ArrayOperation implements AtomicOperation {
  $type = "arrayOperation";
  newValue: object;
  constructor(newValue: object) {
    this.newValue = newValue;
  }
  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export class NoOp implements AtomicOperation {
  $type = "noOp";
  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export class StringOperation implements AtomicOperation {
  $type = "stringOperation";
  rangeStart: number;
  rangeEnd: number;
  newValue: string;

  constructor(rangeStart: number, rangeEnd: number, newValue: string) {
    this.rangeStart = rangeStart;
    this.rangeEnd = rangeEnd;
    this.newValue = newValue;
  }

  transformAgainst = (op: AtomicOperation): AtomicOperation[] => {
    if (op.constructor.name !== "StringOperation") {
      return [this, op];
    }
    const b: StringOperation = op as StringOperation;
    const [a1, a2, b1, b2] = [copy(this), copy(this), copy(b), copy(b)];
    if (this.newValue != "" && b.newValue != "") {
      return [insertInsert(b1, a1), insertInsert(a2, b2)];
    } else if (this.newValue != "" && b.newValue == "") {
      return [insertDelete(a1, b1), deleteInsert(b2, a2)];
    } else if (this.newValue == "" && b.newValue != "") {
      return [deleteInsert(a1, b1), insertDelete(b2, a2)];
    } else {
      return [deleteDelete(b1, a1, false), deleteDelete(a2, b2, true)];
    }
  };
}

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
  operation: new NoOp(),
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

const copy = <T>(a: T): T => JSON.parse(JSON.stringify(a));

const insertInsert = (
  o1: StringOperation,
  o2: StringOperation
): StringOperation => {
  if (o1.rangeStart > o2.rangeStart) {
    o1.rangeStart += o2.newValue.length;
    o1.rangeEnd += o2.newValue.length;
  }
  return o1;
};

const insertDelete = (
  o1: StringOperation,
  o2: StringOperation
): StringOperation => {
  if (o1.rangeStart <= o2.rangeStart) {
    return o1;
  } else if (o1.rangeStart > o2.rangeEnd) {
    o1.rangeStart -= o2.newValue.length;
    o1.rangeEnd -= o2.newValue.length;
  } else if (o2.rangeStart <= o1.rangeStart) {
    const shift = o1.rangeStart - o2.rangeStart;
    o1.rangeStart -= shift;
    o1.rangeEnd -= shift;
  }
  return o1;
};

const deleteInsert = (
  o1: StringOperation,
  o2: StringOperation
): StringOperation => {
  return o1;
};

const deleteDelete = (
  o1: StringOperation,
  o2: StringOperation,
  isLast: boolean
): StringOperation => {
  if (o1.rangeStart == o2.rangeStart && o1.rangeEnd == o2.rangeEnd) {
    if (isLast) {
      o1.rangeEnd = o1.rangeStart;
    }
    return o1;
  }
  if (o2.rangeStart >= o1.rangeEnd) {
    return o1;
  } else if (o1.rangeStart >= o2.rangeEnd) {
    const length = o2.rangeEnd - o2.rangeStart;
    o1.rangeStart -= length;
    o1.rangeEnd -= length;
  } else {
    if (o2.rangeStart <= o1.rangeStart) {
      if (o1.rangeEnd <= o2.rangeEnd) {
        o1.rangeEnd = o1.rangeStart;
      } else {
        o1.rangeStart = o2.rangeEnd;
      }
    } else if (o2.rangeEnd > o1.rangeEnd) {
      o1.rangeEnd = o2.rangeStart;
    }
  }
  return o1;
};
