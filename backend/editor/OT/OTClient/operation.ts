// Represents atomic operations that can be applied to a piece of data of a specific type
// TODO: in the future update object operation to strictly contain CMS operation data
type stringOperation = { rangeStart: number; rangeEnd: number, newValue: string };
type integerOperation = { newValue: number };
type booleanOperation = { newValue: boolean };
type objectOperation = { newValue: object }; 
type arrayOperation = { newValue: object };
type noop = {};

// atomicOperation is a single operation that can be applied in our system
type atomicOperation = 
| { type: "stringOperation", stringOperation: stringOperation }
| { type: "integerOperation", integerOperation: integerOperation }
| { type: "booleanOperation", booleanOperation: booleanOperation }
| { type: "objectOperation", objectOperation: objectOperation }
| { type: "arrayOperation", arrayOperation: arrayOperation }
| { type: "noop", noop: noop}

// operation is the atomic operation that is sent between clients and servers
export type Operation = {
    Path: number[],
    OperationType: "insert" | "delete",

    IsNoOp: boolean
    Operation: atomicOperation
}

export const noop: Operation = { 
    Path: [], 
    OperationType: "insert", 
    IsNoOp: true, 
    Operation:  {
        type: "noop",
        noop: {}
    }
};

// Actual OT transformation functions
export const transform = (
    a: Operation,
    b: Operation
  ): [Operation, Operation] => {
    const transformedPaths = transformPaths(a, b);
    [a.Path, b.Path] = transformedPaths;
  
    return [normalise(a), normalise(b)];
  };
  
  /**
   * Takes in two operations and transforms them accordingly, note that it only
   * returns the updated paths
   */
  const transformPaths = (a: Operation, b: Operation): [number[], number[]] => {
    const tp = transformationPoint(a.Path, b.Path);
    if (!effectIndependent(a.Path, b.Path, tp)) {
      switch (true) {
        case a.OperationType === "insert" && b.OperationType === "insert":
          return transformInserts(a.Path, b.Path, tp);
        case a.OperationType === "delete" && b.OperationType === "delete":
          return transformDeletes(a.Path, b.Path, tp);
        case a.OperationType === "insert" && b.OperationType === "delete":
          return transformInsertDelete(a.Path, b.Path, tp);
        default:
          const result = transformInsertDelete(b.Path, a.Path, tp);
          result.reverse();
          return result;
      }
    }
  
    return [a.Path, b.Path];
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
          : (a.length < b.length
            ? [a, update(b, tp, 1)]
            : [a, b]);
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
          : (a.length < b.length
            ? [a, []]
            : [[], []]);
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
    [...Array(Math.min(a.length, b.length)).keys()].find(
      (i) => a[i] != b[i]
    ) ?? Math.min(a.length, b.length);
  
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
  const normalise = (a: Operation): Operation => (a.Path.length === 0 ? noop : a);