// operation is the atomic operation that is sent between clients and servers
export interface Operation {
  path: number[];
  opType: "insert" | "delete";

  isNoOp: boolean;
  atomicOp: AtomicOperation;
}

// Represents atomic operations that can be applied to a piece of data of a specific type
// TODO: in the future update object operation to strictly contain CMS operation data
export interface AtomicOperation {
  type: string;
  transformAgainst: (op: AtomicOperation) => AtomicOperation[];
}

export class IntegerOperation implements AtomicOperation {
  type = "integerOperation";
  newValue: number;
  constructor(newValue: number) {
    this.newValue = newValue;
  }

  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export class BooleanOperation implements AtomicOperation {
  type = "booleanOperation";
  newValue: boolean;
  constructor(newValue: boolean) {
    this.newValue = newValue;
  }
  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export class ObjectOperation implements AtomicOperation {
  type = "objectOperation";
  newValue: object;
  constructor(newValue: object) {
    this.newValue = newValue;
  }
  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export class ArrayOperation implements AtomicOperation {
  type = "arrayOperation";
  newValue: object;
  constructor(newValue: object) {
    this.newValue = newValue;
  }
  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export class StringOperation implements AtomicOperation {
  type = "stringOperation";
  start: number;
  end: number;
  newValue: string;

  constructor(start: number, end: number, newValue: string) {
    this.start = start;
    this.end = end;
    this.newValue = newValue;
  }

  transformAgainst = (op: AtomicOperation): AtomicOperation[] => {
    if (op.constructor.name !== "StringOperation") {
      return [this, op];
    }
    const b: StringOperation = op as StringOperation;
    const [a1, a2, b1, b2] = [copy(this), copy(this), copy(b), copy(b)];

    // This implementation is a TypeScript copy of the server string transform
    // functions which contain more comments explaining the implementation
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

/**
 * Return first string operation transformed against second operation when both
 * are insert operations
 */
const insertInsert = (
  o1: StringOperation,
  o2: StringOperation
): StringOperation => {
  if (o1.start > o2.start) {
    o1.start += o2.newValue.length;
    o1.end += o2.newValue.length;
  }
  return o1;
};

/**
 * Return first string operation transformed against second operation when first
 * is insert and second is delete
 */
const insertDelete = (
  o1: StringOperation,
  o2: StringOperation
): StringOperation => {
  if (o1.start <= o2.start) {
    return o1;
  } else if (o1.start > o2.end) {
    o1.start -= o2.newValue.length;
    o1.end -= o2.newValue.length;
  } else if (o2.start <= o1.start) {
    const shift = o1.start - o2.start;
    o1.start -= shift;
    o1.end -= shift;
  }
  return o1;
};

/**
 * Return first string operation transformed against second operation when first
 * is delete and second is insert
 */
const deleteInsert = (
  o1: StringOperation,
  o2: StringOperation
): StringOperation => {
  return o1;
};

/**
 * Return first string operation transformed against second operation when both
 * are delete operations
 */
const deleteDelete = (
  o1: StringOperation,
  o2: StringOperation,
  isLast: boolean
): StringOperation => {
  if (o1.start == o2.start && o1.end == o2.end) {
    if (isLast) {
      o1.end = o1.start;
    }
    return o1;
  }
  if (o2.start >= o1.end) {
    return o1;
  } else if (o1.start >= o2.end) {
    const length = o2.end - o2.start;
    o1.start -= length;
    o1.end -= length;
  } else {
    if (o2.start <= o1.start) {
      if (o1.end <= o2.end) {
        o1.end = o1.start;
      } else {
        o1.start = o2.end;
      }
    } else if (o2.end > o1.end) {
      o1.end = o2.start;
    }
  }
  return o1;
};

export class NoOp implements AtomicOperation {
  type = "noOp";
  transformAgainst = (op: AtomicOperation): AtomicOperation[] => [this, op];
}

export const noOp: Operation = {
  path: [],
  opType: "insert",
  isNoOp: true,
  atomicOp: new NoOp(),
};

/**
 * Deepcopy an object
 */
const copy = <T>(a: T): T => JSON.parse(JSON.stringify(a));
